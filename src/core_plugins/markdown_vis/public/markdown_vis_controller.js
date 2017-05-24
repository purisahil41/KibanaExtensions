import marked from 'marked';
import uiModules from 'ui/modules';
import 'angular-sanitize';

marked.setOptions({
    gfm: true, // Github-flavored markdown
    sanitize: true // Sanitize HTML tags
});

function getParameter(paramName) {

    var restString = window.location.href.substring(window.location.href.indexOf(paramName), window.location.href.length - 1);
    if(restString.indexOf('&') != -1)
    {
      restString = restString.substring(0, restString.indexOf('&'));
    } 
    return restString.substring(3, restString.length - 1);
}


const module = uiModules.get('kibana/markdown_vis', ['kibana']);
module.controller('KbnMarkdownVisController', function($scope, $sce, $timeout) {

    $scope.to_trusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
    }

    $scope.$watch('vis.params.markdown', function(html) {
        if (!html) return;
        //---------------------------------------------
        // CHANGING TO SUIT FILTER PERSISTENCE
        //--------------------------------------------
        var htmlDoc = marked(html);
        var dashList = htmlDoc.split("\n");
        var modHtmlDoc = "";
        for (var i = 0; i < dashList.length - 1; i++) {
            var anchorName = $(dashList[i]).find('a').text();
            var anchorLocation = $(dashList[i]).find('a').attr('href');
            var windowsState = window.location.href;
            if (window.location.hash.startsWith(anchorLocation)) {
                modHtmlDoc += '<div class="dashboardLink dashboardLinkSelected" href="' + anchorLocation + '">' + anchorName + '</div>';
            }
            else
            {
                modHtmlDoc += '<div class="dashboardLink" href="' + anchorLocation + '">' + anchorName + '</div>';
            }
            
        }
        $scope.html = modHtmlDoc;
        $timeout(function() {
            $('.dashboardLink').click(function() {
                // Get All Parameters in window state

                if (!window.location.hash.startsWith($(this).attr('href'))) {
                    var allParam = window.location.hash.split('?')[1];

                    // Get _a parameter for processing
                    var aParameter = getParameter('_a');

                    //CHECK FOR FILTER -- Manipulating Filter parameter and appending in all parameters
                    if (aParameter.indexOf('filters:!()') != -1) {
                        var finUrl = window.location.origin + window.location.pathname + $(this).attr('href');
                    } else {
                        allParam = allParam.substring(0, allParam.indexOf('_a')) + "_a=" + aParameter.split(',options:(')[0] + ")"; // + ",options:" + aParameter.split(',options:')[1];     
                        var relUrl = $(this).attr('href') + "?" + allParam;
                        var finUrl = window.location.origin + window.location.pathname + relUrl;
                    }

                    //CHECK FOR QUERY -- Append on the basis of filter preserved or not!
                    var queryParam = window.location.hash.substring(window.location.hash.indexOf('query:(query_string'), window.location.hash.indexOf(',title:'));
                    if(finUrl.indexOf('_a') != -1 && finUrl.indexOf('query:(query_string:') != -1)
                    {
                      finUrl = finUrl.substring(0, finUrl.indexOf('query:(query_string:')) + queryParam + finUrl.substring(finUrl.indexOf(',title:'), finUrl.length - 1);
                    }
                    else if(finUrl.indexOf('_a') != -1){
                      finUrl = finUrl.substring(0, finUrl.length - 1) + "," +  queryParam + ")"; 
                    }
                    else{
                      finUrl = finUrl + "?_a=(" + queryParam + ")"; 
                    }                  
                    
                    window.location = finUrl;
                }
            });
        });
        //---------------------------------------------
        // CHANGE END
        //--------------------------------------------
        // $scope.html = marked(html);
    });




});