import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import mainTemplate from './templates/index.html';

uiRoutes.enable();
uiRoutes
.when('/', {
  template: mainTemplate,
  controller: 'plugwebpageController',
  controllerAs: 'ctrl'
})


uiModules
.get('app/plug_webpage')
.controller('plugwebpageController', function () {

	$('.UrlToGo').click(function()
	{
		document.getElementById("YourPage").innerHTML='<object style="width:100%;height:100%;" type="text/html" data="' + $('.UrlBox').val() + '" ></object>';
	});
 
});
