import { __rest, __assign } from '../node_modules/.pnpm/@rollup_plugin-typescript@12.1.2_rollup@4.30.1_tslib@2.8.1_typescript@5.7.3/node_modules/tslib/tslib.es6.js';
import React from 'react';

var Button = function (_a) {
    var children = _a.children, _b = _a.variant, variant = _b === undefined ? 'primary' : _b, _c = _a.size, size = _c === undefined ? 'medium' : _c, _d = _a.disabled, disabled = _d === undefined ? false : _d, onClick = _a.onClick, _e = _a.className, className = _e === undefined ? '' : _e, _f = _a.type, type = _f === undefined ? 'button' : _f, rest = __rest(_a, ["children", "variant", "size", "disabled", "onClick", "className", "type"]);
    var baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    var variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };
    var sizes = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
    };
    var disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer cursor';
    return (React.createElement("button", __assign({ type: type, onClick: onClick, disabled: disabled, className: "".concat(baseStyles, " ").concat(variants[variant], " ").concat(sizes[size], " ").concat(disabledStyles, " ").concat(className) }, rest), children));
};

export { Button as default };
//# sourceMappingURL=index.js.map
