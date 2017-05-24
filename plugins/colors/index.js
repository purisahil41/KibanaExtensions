export default function (kibana) {
	return new kibana.Plugin({
		id: 'colors',
		require: ['kibana', 'elasticsearch'],
		uiExports: {
  			hacks: [
    			'plugins/colors/hack'
  			]
		}
	});
};