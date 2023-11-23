export class CssUnitHelper {
    public static convertCssUnit(cssValue: string, target: Element = document.body): number | null {
        const supportedUnits: { [key: string]: any } = {
            // Absolute sizes
            'px': (value: number) => value,
            'cm': (value: number) => value * 38,
            'mm': (value: number) => value * 3.8,
            'q': (value: number) => value * 0.95,
            'in': (value: number) => value * 96,
            'pc': (value: number) => value * 16,
            'pt': (value: number) => value * 1.333333,
            // Relative sizes
            'rem': (value: number) => value * parseFloat(getComputedStyle(document.documentElement).fontSize),
            'em': (value: number) => value * parseFloat(getComputedStyle(target).fontSize),
            'vw': (value: number) => value / 100 * window.innerWidth,
            'vh': (value: number) => value / 100 * window.innerHeight,
        };
        // Match positive and negative numbers including decimals with following unit
        const pattern = new RegExp(`^([\-\+]?(?:\\d+(?:\\.\\d+)?))(${Object.keys(supportedUnits).join('|')})$`, 'i');

        // If is a match, return example: [ "-2.75rem", "-2.75", "rem" ]
        const matches = String.prototype.toString.apply(cssValue).trim().match(pattern);

        if (matches) {
            const value = Number(matches[1]);
            const unit = matches[2].toLocaleLowerCase();

            if (unit in supportedUnits) {
                return supportedUnits[unit](value);
            }
        }

        return null;
    };
}