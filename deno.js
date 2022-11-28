// From: https://github.com/sindresorhus/has-flag/blob/main/index.js
function hasFlag(flag, argv = Deno.args) {
    const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--')
    const position = argv.indexOf(prefix + flag)
    const terminatorPosition = argv.indexOf('--')
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition)
}

const { env } = Deno

let flagForceColor
if (
    hasFlag('no-color')
    || hasFlag('no-colors')
    || hasFlag('color=false')
    || hasFlag('color=never')
) {
    flagForceColor = 0
} else if (
    hasFlag('color')
    || hasFlag('colors')
    || hasFlag('color=true')
    || hasFlag('color=always')
) {
    flagForceColor = 1
}

function envForceColor() {
    const FORCE_COLOR = env.get('FORCE_COLOR')
    if (FORCE_COLOR) {
        if (FORCE_COLOR === 'true') {
            return 1
        }

        if (FORCE_COLOR === 'false') {
            return 0
        }

        return FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(FORCE_COLOR, 10), 3)
    }
}

function translateLevel(level) {
    if (level === 0) {
        return false
    }

    return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3,
    }
}

function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
    const noFlagForceColor = envForceColor()
    if (noFlagForceColor !== undefined) {
        flagForceColor = noFlagForceColor
    }

    const forceColor = sniffFlags ? flagForceColor : noFlagForceColor

    if (forceColor === 0) {
        return 0
    }

    if (sniffFlags) {
        if (hasFlag('color=16m')
            || hasFlag('color=full')
            || hasFlag('color=truecolor')) {
            return 3
        }

        if (hasFlag('color=256')) {
            return 2
        }
    }

    if (haveStream && !streamIsTTY && forceColor === undefined) {
        return 0
    }

    const min = forceColor || 0

    const TERM = env.get('TERM')
    if (TERM === 'dumb') {
        return min
    }

    if (Deno.build.os === 'windows') {
        // Windows 10 build 10586 is the first Windows release that supports 256 colors.
        // Windows 10 build 14931 is the first release that supports 16m/TrueColor.
        const osRelease = Deno.osRelease().split('.')
        if (
            Number(osRelease[0]) >= 10
            && Number(osRelease[2]) >= 10_586
        ) {
            return Number(osRelease[2]) >= 14_931 ? 3 : 2;
        }

        return 1
    }

    if (env.get("CI")) {
        if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE', 'DRONE'].some(sign => sign in env) || env.get("CI_NAME") === 'codeship') {
            return 1
        }

        return min
    }

    const TEAMCITY_VERSION = env.get("TEAMCITY_VERSION")
    if (TEAMCITY_VERSION) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(TEAMCITY_VERSION) ? 1 : 0
    }

    // Check for Azure DevOps pipelines
    if (env.get('TF_BUILD') && env.get('AGENT_NAME')) {
        return 1
    }

    if (env.get('COLORTERM') === 'truecolor') {
        return 3
    }

    const TERM_PROGRAM = env.get('TERM_PROGRAM')
    if (TERM_PROGRAM) {
        const version = Number.parseInt((env.get('TERM_PROGRAM_VERSION') || '').split('.')[0], 10)

        switch (TERM_PROGRAM) {
            case 'iTerm.app':
                return version >= 3 ? 3 : 2
            case 'Apple_Terminal':
                return 2
            // No default
        }
    }

    if (/-256(color)?$/i.test(TERM)) {
        return 2
    }

    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(TERM)) {
        return 1
    }

    if (env.get('COLORTERM')) {
        return 1
    }

    return min
}

export function createSupportsColor(stream, options = {}) {
    const level = _supportsColor(stream, {
        streamIsTTY: stream && stream.isTTY,
        ...options,
    })

    return translateLevel(level)
}

const supportsColor = {
    stdout: createSupportsColor({ isTTY: Deno.isatty(1) }),
    stderr: createSupportsColor({ isTTY: Deno.isatty(2) }),
}

export default supportsColor