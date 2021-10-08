module.exports = () => {
	return {
		module: {
			rules: [{
				test: /\.svg/,
				use: {
					// loader: 'svg-inline-loader?classPrefix',
					loader: 'svg-url-loader',
					options: {}
				}
			}]
		}
	};
};