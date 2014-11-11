angular.module('templates-app', ['canvas/canvas.tpl.html', 'canvas/draw-outline.tpl.html', 'canvas/draw-oval.tpl.html', 'canvas/draw-rect.tpl.html', 'components/draw-input.tpl.html', 'full-page/full-page.tpl.html', 'header/header.tpl.html', 'overlay/overlay.tpl.html', 'panel/panel.tpl.html', 'toolbar/toolbar.tpl.html']);

angular.module("canvas/canvas.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("canvas/canvas.tpl.html",
    "<!-- \"oncontextmenu\" disables right clicking in the canvas -->\n" +
    "<div class=\"canvas-wrap\" ng-controller=\"CanvasController\" oncontextmenu=\"return false;\">\n" +
    "  <svg \n" +
    "    class=\"canvas\"\n" +
    "    ng-style=\"{\n" +
    "      width: canvasWidth,\n" +
    "      height: canvasHeight,\n" +
    "      opacity: showCanvas ? 1 : 0\n" +
    "    }\"\n" +
    "    ng-class=\"{\n" +
    "      draw: state.tool == 'rectangle' || state.tool == 'oval', \n" +
    "      transform: state.tool == 'transform',\n" +
    "      text: state.tool == 'text'\n" +
    "    }\"\n" +
    "    ng-mousedown=\"mouseDown($event)\" \n" +
    "    ng-mousemove=\"mouseMove($event)\" \n" +
    "    ng-mouseup=\"mouseUp($event)\">\n" +
    "    <draw-rect layer=\"background\"></draw-rect>\n" +
    "    <svg ng-repeat=\"layer in Drawing.current.layers | reverse\">\n" +
    "      <draw-rect ng-if=\"layer.type == 'rectangle'\" layer=\"layer\"></draw-rect>\n" +
    "      <draw-oval ng-if=\"layer.type == 'oval'\" layer=\"layer\"></draw-oval>\n" +
    "      <!-- <text x=\"100\" y=\"100\">d: {{ layer }}</text> -->\n" +
    "\n" +
    "     <!--  <foreignObject ng-if=\"shape.type == 'text'\" ng-attr-x=\"{{ shape.x }}\" ng-attr-y=\"{{ shape.y }}\" ng-attr-width=\"{{ shape.getWidth() }}\" ng-attr-height=\"{{ shape.getHeight() }}\" ng-controller=\"ShapeCtrl\" ng-class=\"{active: shape.active}\">\n" +
    "        <textarea \n" +
    "          class=\"svg-text\" \n" +
    "          ng-controller=\"TextCtrl\" \n" +
    "          ng-style=\"{\n" +
    "            width: shape.getWidth() + 'px',\n" +
    "            height: shape.getHeight() + 'px',\n" +
    "            'font-size': shape.size + 'px',\n" +
    "            color: shape.color\n" +
    "          }\" \n" +
    "          ng-click=\"click($event)\" \n" +
    "          ng-mousedown=\"mouseDown($event)\" \n" +
    "          ng-mouseup=\"mouseUp($event)\" \n" +
    "          ng-focus=\"focus()\"></textarea>\n" +
    "      </foreignObject> -->\n" +
    "    </svg>\n" +
    "    <svg>\n" +
    "      <draw-outline layer=\"background\" background=\"true\"></draw-outline>\n" +
    "      <draw-outline ng-if=\"Drawing.current.layerOutline\" layer=\"Drawing.current.layerOutline\"></draw-outline>\n" +
    "    </svg>\n" +
    "    <!-- <text x=\"100\" y=\"100\">d: {{ Drawing.current.layerCurrent }}</text> -->\n" +
    "\n" +
    "  </svg>\n" +
    "</div>");
}]);

angular.module("canvas/draw-outline.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("canvas/draw-outline.tpl.html",
    "<svg class=\"layer-outline\">\n" +
    "	<!-- size bubble -->\n" +
    "  <rect \n" +
    "		ng-if=\"!background\"\n" +
    "		ng-show=\"layer.drawing\"\n" +
    "		class=\"dimension-text-bg\"\n" +
    "		width=\"75\"\n" +
    "		height=\"22\"\n" +
    "		rx=\"5\"\n" +
    "		ry=\"5\"\n" +
    "		ng-attr-x=\"{{ layer.getX() + layer.getWidth() + 10 }}\" \n" +
    "		ng-attr-y=\"{{ layer.getY() }}\" />\n" +
    "  <text \n" +
    "  	ng-if=\"!background\" \n" +
    "  	ng-attr-x=\"{{ layer.getX() + layer.getWidth() + 20 }}\" \n" +
    "  	ng-attr-y=\"{{ layer.getY() + 15 }}\" \n" +
    "  	class=\"dimension-text\" \n" +
    "  	ng-show=\"layer.drawing\">{{ layer.getWidth() }} x {{ layer.getHeight() }}</text>\n" +
    "  \n" +
    "  <!-- outline -->\n" +
    "  <rect \n" +
    "    class=\"outline\" ng-class=\"{\n" +
    "      drawing: layer.drawing,\n" +
    "      'panel-hover': layer.panelHover\n" +
    "    }\"\n" +
    "    ng-attr-x=\"{{ layer.getX() }}\" \n" +
    "    ng-attr-y=\"{{ layer.getY() }}\" \n" +
    "    ng-attr-width=\"{{ layer.getWidth() }}\" \n" +
    "    ng-attr-height=\"{{ layer.getHeight() }}\" />\n" +
    "\n" +
    "  <!-- resize lines (invisible areas) -->\n" +
    "  <line \n" +
    "    ng-if=\"!background\"\n" +
    "    class=\"resize-line resize-line-n\"\n" +
    "    ng-attr-x1=\"{{ layer.getX() }}\" \n" +
    "    ng-attr-x2=\"{{ layer.getX() + layer.getWidth() }}\" \n" +
    "    ng-attr-y1=\"{{ layer.getY() - 2 }}\" \n" +
    "    ng-attr-y2=\"{{ layer.getY() }}\" \n" +
    "    ng-mouseDown=\"layer.mouseDown($event, 'resizeLineN')\" />\n" +
    "  <line \n" +
    "    ng-if=\"!background\"\n" +
    "    class=\"resize-line resize-line-e\"\n" +
    "    ng-attr-x1=\"{{ layer.getX() + layer.getWidth() }}\" \n" +
    "    ng-attr-x2=\"{{ layer.getX() + layer.getWidth() }}\" \n" +
    "    ng-attr-y1=\"{{ layer.getY() }}\" \n" +
    "    ng-attr-y2=\"{{ layer.getY() + layer.getHeight() }}\" \n" +
    "    ng-mouseDown=\"layer.mouseDown($event, 'resizeLineE')\" />\n" +
    "  <line \n" +
    "    ng-if=\"!background\"\n" +
    "    class=\"resize-line resize-line-s\"\n" +
    "    ng-attr-x1=\"{{ layer.getX() }}\" \n" +
    "    ng-attr-x2=\"{{ layer.getX() + layer.getWidth() }}\" \n" +
    "    ng-attr-y1=\"{{ layer.getY() + layer.getHeight() }}\" \n" +
    "    ng-attr-y2=\"{{ layer.getY() + layer.getHeight() }}\"\n" +
    "    ng-mouseDown=\"layer.mouseDown($event, 'resizeLineS')\" />\n" +
    "  <line \n" +
    "    ng-if=\"!background\"\n" +
    "    class=\"resize-line resize-line-w\"\n" +
    "    ng-attr-x1=\"{{ layer.getX() }}\" \n" +
    "    ng-attr-x2=\"{{ layer.getX() }}\" \n" +
    "    ng-attr-y1=\"{{ layer.getY() }}\" \n" +
    "    ng-attr-y2=\"{{ layer.getY() + layer.getHeight() }}\"\n" +
    "    ng-mouseDown=\"layer.mouseDown($event, 'resizeLineW')\" />\n" +
    "\n" +
    "  <!-- diagonal boxes -->\n" +
    "  <rect \n" +
    "    ng-if=\"!background\"\n" +
    "    class=\"outline fill resize-diagonal resize-diagonal-nw\" ng-class=\"{\n" +
    "      drawing: layer.drawing,\n" +
    "      'panel-hover': layer.panelHover\n" +
    "    }\"\n" +
    "    ng-attr-x=\"{{ layer.getX() - (DIAGONAL_BOX_SIZE / 2) }}\" \n" +
    "    ng-attr-y=\"{{ layer.getY() - (DIAGONAL_BOX_SIZE / 2) }}\" \n" +
    "    ng-attr-width=\"{{ DIAGONAL_BOX_SIZE }}\" \n" +
    "    ng-attr-height=\"{{ DIAGONAL_BOX_SIZE }}\"\n" +
    "    ng-mouseDown=\"layer.mouseDown($event, 'resizeLineNW')\" />\n" +
    "  <rect \n" +
    "    ng-if=\"!background\"\n" +
    "    class=\"outline fill resize-diagonal resize-diagonal-ne\" ng-class=\"{\n" +
    "      drawing: layer.drawing,\n" +
    "      'panel-hover': layer.panelHover\n" +
    "    }\"\n" +
    "    ng-attr-x=\"{{ layer.getX() + layer.getWidth() - (DIAGONAL_BOX_SIZE / 2) }}\" \n" +
    "    ng-attr-y=\"{{ layer.getY() - (DIAGONAL_BOX_SIZE / 2) }}\" \n" +
    "    ng-attr-width=\"{{ DIAGONAL_BOX_SIZE }}\" \n" +
    "    ng-attr-height=\"{{ DIAGONAL_BOX_SIZE }}\"\n" +
    "    ng-mouseDown=\"layer.mouseDown($event, 'resizeLineNE')\" />\n" +
    "  <rect \n" +
    "    ng-if=\"!background\"\n" +
    "    class=\"outline fill resize-diagonal resize-diagonal-se\" ng-class=\"{\n" +
    "      drawing: layer.drawing,\n" +
    "      'panel-hover': layer.panelHover\n" +
    "    }\"\n" +
    "    ng-attr-x=\"{{ layer.getX() + layer.getWidth() - (DIAGONAL_BOX_SIZE / 2) }}\" \n" +
    "    ng-attr-y=\"{{ layer.getY() + layer.getHeight() - (DIAGONAL_BOX_SIZE / 2) }}\" \n" +
    "    ng-attr-width=\"{{ DIAGONAL_BOX_SIZE }}\" \n" +
    "    ng-attr-height=\"{{ DIAGONAL_BOX_SIZE }}\"\n" +
    "    ng-mouseDown=\"layer.mouseDown($event, 'resizeLineSE')\" />\n" +
    "  <rect \n" +
    "    ng-if=\"!background\"\n" +
    "    class=\"outline fill resize-diagonal resize-diagonal-sw\" ng-class=\"{\n" +
    "      drawing: layer.drawing,\n" +
    "      'panel-hover': layer.panelHover\n" +
    "    }\"\n" +
    "    ng-attr-x=\"{{ layer.getX() - (DIAGONAL_BOX_SIZE / 2) }}\" \n" +
    "    ng-attr-y=\"{{ layer.getY() + layer.getHeight() - (DIAGONAL_BOX_SIZE / 2) }}\" \n" +
    "    ng-attr-width=\"{{ DIAGONAL_BOX_SIZE }}\" \n" +
    "    ng-attr-height=\"{{ DIAGONAL_BOX_SIZE }}\"\n" +
    "    ng-mouseDown=\"layer.mouseDown($event, 'resizeLineSW')\" />\n" +
    "\n" +
    "</svg>");
}]);

angular.module("canvas/draw-oval.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("canvas/draw-oval.tpl.html",
    "<svg class=\"layer-wrap\">\n" +
    "  <ellipse \n" +
    "  	class=\"layer\" \n" +
    "  	ng-attr-cx=\"{{ layer.getCX() }}\" \n" +
    "  	ng-attr-cy=\"{{ layer.getCY() }}\" \n" +
    "  	ng-attr-rx=\"{{ layer.getWidth() / 2 }}\" \n" +
    "  	ng-attr-ry=\"{{ layer.getHeight() / 2 }}\" \n" +
    "  	ng-attr-stroke=\"{{ layer.stroke.color }}\" \n" +
    "  	ng-attr-stroke-width=\"{{ layer.stroke.width }}\" \n" +
    "    ng-attr-fill=\"{{ layer.color }}\"\n" +
    "    ng-attr-fill-opacity=\"{{ layer.drawing ? 0.3 : layer.fillOpacity * .01 }}\" />\n" +
    "</svg>");
}]);

angular.module("canvas/draw-rect.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("canvas/draw-rect.tpl.html",
    "<svg class=\"layer-wrap\">\n" +
    "  <rect \n" +
    "  	class=\"layer\" \n" +
    "  	ng-attr-x=\"{{ layer.getX() }}\" \n" +
    "  	ng-attr-y=\"{{ layer.getY() }}\" \n" +
    "  	ng-attr-width=\"{{ layer.getWidth() }}\" \n" +
    "  	ng-attr-height=\"{{ layer.getHeight() }}\" \n" +
    "  	ng-attr-stroke=\"{{ layer.stroke.color }}\" \n" +
    "  	ng-attr-stroke-width=\"{{ layer.stroke.width }}\" \n" +
    "    ng-attr-fill=\"{{ layer.color }}\"\n" +
    "    ng-attr-fill-opacity=\"{{ layer.getOpacity() }}\"\n" +
    "    ng-attr-rx=\"{{ layer.radius }}\"\n" +
    "    ng-attr-ry=\"{{ layer.radius }}\" />\n" +
    "  <!-- <text ng-attr-x=\"{{ layer.getX() }}\" ng-attr-y=\"{{ layer.getY() }}\">{{ layer.y }}</text>  -->\n" +
    "</svg>");
}]);

angular.module("components/draw-input.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/draw-input.tpl.html",
    "<span>\n" +
    "<input type=\"text\" class=\"input-dark attr-edit\" ng-model=\"tempModel\" ng-blur=\"blur($event)\" ng-focus=\"focus($event)\" />\n" +
    "</span>");
}]);

angular.module("full-page/full-page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("full-page/full-page.tpl.html",
    "<div class=\"full-page-wrap\" ng-controller=\"FullPageController\">\n" +
    "	<div ng-include=\"'canvas/canvas.tpl.html'\"></div>\n" +
    "	<div ng-include=\"'toolbar/toolbar.tpl.html'\"></div>\n" +
    "	<div ng-include=\"'panel/panel.tpl.html'\"></div>\n" +
    "	<div ng-include=\"'header/header.tpl.html'\"></div>\n" +
    "	<div ng-include=\"'overlay/overlay.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("header/header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("header/header.tpl.html",
    "<div class=\"header-wrap\" ng-controller=\"HeaderController\">\n" +
    "	<h1>Draw</h1>\n" +
    "	<button class=\"active-color\" ng-style=\"{background: colorPalette.color}\" ng-click=\"panel.show('colors', 'right', 'layers'); colorPalette.current.model = colorPalette\"></button>\n" +
    "	<span class=\"save-state\">{{ state.saveState }}</span>\n" +
    "	<!-- <div class=\"font-size-wrap\" ng-if=\"state.tool == 'text'\">\n" +
    "	  <input type=\"text\" class=\"font-size-input\" ng-model=\"current.shape.font.size\" /><div class=\"btn-group font-size-dropdown\" dropdown>\n" +
    "	    <button type=\"button\" class=\"btn btn-primary dropdown-toggle\">\n" +
    "	      <span class=\"caret\"></span>\n" +
    "	    </button>\n" +
    "	    <ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">\n" +
    "	      <li ng-repeat=\"SIZE in FONT_SIZES\"><button ng-click=\"fontSizeClick($event, SIZE)\">{{ SIZE }}</button></li>\n" +
    "	    </ul>\n" +
    "	  </div>\n" +
    "	</div> -->\n" +
    "</div>");
}]);

angular.module("overlay/overlay.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("overlay/overlay.tpl.html",
    "<div class=\"overlay-wrap\" ng-controller=\"OverlayController\" ng-class=\"{\n" +
    "	'preshow': overlay.preshow,\n" +
    "	'visible': overlay.visible,\n" +
    "	'hide': hide\n" +
    "}\">\n" +
    "	<div class=\"overlay\">\n" +
    "		<h2 class=\"overlay-header\">Create a new drawing.</h2>\n" +
    "		<input type=\"text\" class=\"input-dark title-input\" placeholder=\"Name your drawing\" ng-model=\"drawingTitle\" />\n" +
    "		<button class=\"start-button\" ng-click=\"createDrawing()\" ng-disabled=\"!drawingTitle.length\">Start</button>\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("panel/panel.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("panel/panel.tpl.html",
    "<div class=\"panel-wrap\" ng-class=\"{'sorting': sorting}\" ng-controller=\"PanelController\">\n" +
    "  <div class=\"panel\">\n" +
    "    <div ng-class=\"{\n" +
    "      'active': panel.active == 'drawings',\n" +
    "      'transition': panel.transition,\n" +
    "      'staging-right': panel.stagingRight == 'drawings',\n" +
    "      'staging-left': panel.stagingLeft == 'drawings'\n" +
    "    }\">\n" +
    "      <div class=\"top-wrap main\">\n" +
    "        <i class=\"add fa fa-plus\" ng-click=\"newDrawing()\"></i> <h2 class=\"panel-title\">Drawings</h2>\n" +
    "      </div>\n" +
    "      <div class=\"btn-group-vertical layer-layers\" ui-sortable=\"sortableOptions\" ng-model=\"Drawing.drawings\">\n" +
    "        <!-- <label class=\"btn\" ng-repeat=\"drawing in Drawing.drawings | orderBy:'title'\" ng-model=\"Drawing.current\" btn-radio=\"drawing\"> -->\n" +
    "        <!-- <label class=\"btn\" ng-repeat=\"drawing in Drawing.drawings | orderBy:'title'\" ng-model=\"Drawing.current\" btn-radio=\"drawing\" ui-sref=\"drawing({drawingId: drawing.id})\"> -->\n" +
    "        <label class=\"btn\" ng-repeat=\"drawing in Drawing.drawings | orderBy:'title'\" ng-model=\"Drawing.current\" btn-radio=\"drawing\">\n" +
    "          <div class=\"clearfix\">\n" +
    "            <i class=\"thumbnail thumbnail-box\" ng-style=\"{background: '#fff'}\"></i>\n" +
    "            <p class=\"text\">{{ drawing.title }}</p>\n" +
    "            <i class=\"edit-layer fa fa-pencil\" ng-click=\"panel.show('layers', 'right')\"></i>\n" +
    "          </div>\n" +
    "        </label>\n" +
    "      </div>\n" +
    "      <!-- <div style=\"font-size: 9px; color: yellow;\">{{ Drawing.current }}</div> -->\n" +
    "    </div>  \n" +
    "    <div class=\"panel-main\" ng-class=\"{\n" +
    "      'active': panel.active == 'layers',\n" +
    "      'transition': panel.transition,\n" +
    "      'staging-right': panel.stagingRight == 'layers',\n" +
    "      'staging-left': panel.stagingLeft == 'layers'\n" +
    "    }\">\n" +
    "      <div class=\"top-wrap main\">\n" +
    "        <i class=\"back fa fa-arrow-left\" ng-click=\"panel.show('drawings', 'left')\"></i> <h2 class=\"panel-title\">Edit Drawing</h2>\n" +
    "      </div>\n" +
    "      <!-- <h2 class=\"drawing-title\">Untitled Drawing</h2> -->\n" +
    "      <div class=\"title-edit-wrap slim\">\n" +
    "       <input type=\"text\" class=\"input-dark title-edit main-title\" ng-model=\"Drawing.current.title\" ng-blur=\"Drawing.current.save()\" />\n" +
    "      </div>\n" +
    "      <div class=\"btn-group-vertical layer-layers\" ui-sortable=\"sortableOptions\" ng-model=\"Drawing.current.layers\">\n" +
    "        <label class=\"btn\" ng-repeat=\"layer in Drawing.current.layers\" ng-model=\"Drawing.current.layerCurrent\" btn-radio=\"layer\" ng-click=\"layerClick(layer)\" ng-mouseenter=\"layerMouseEnter(layer)\" ng-mouseleave=\"layerMouseLeave()\">\n" +
    "          <div class=\"clearfix\">\n" +
    "            <i ng-if=\"layer.type == 'rectangle'\" class=\"thumbnail thumbnail-box\" ng-style=\"{background: layer.color}\"></i>\n" +
    "            <i ng-if=\"layer.type == 'oval'\" class=\"thumbnail thumbnail-box thumbnail-oval\" ng-style=\"{background: layer.color}\"></i>\n" +
    "            <i ng-if=\"layer.type == 'text'\" class=\"thumbnail thumbnail-text fa fa-font\" ng-style=\"{color: '{{ colorPalette.color }}'}\"></i>\n" +
    "            <p class=\"text\">{{ layer.title }}</p>\n" +
    "            <!-- <i class=\"edit-layer fa fa-pencil\" ng-click=\"showSecondary($event, layer)\"></i>  -->\n" +
    "            <i class=\"edit-layer fa fa-pencil\" ng-click=\"panel.show('layerDetail', 'right')\"></i>\n" +
    "          </div>\n" +
    "        </label>\n" +
    "      </div>\n" +
    "      <div class=\"btn-group-vertical layer-layers background-layer\">\n" +
    "        <label class=\"btn\" ng-click=\"layerClick(background.layer)\">\n" +
    "          <div class=\"clearfix\">\n" +
    "            <i class=\"thumbnail thumbnail-box\" ng-style=\"{background: background.layer.color}\"></i>\n" +
    "            <p class=\"text\">{{ background.layer.title }}</p>\n" +
    "            <!-- <i class=\"edit-layer fa fa-pencil\" ng-click=\"showSecondary($event, background.layer)\"></i>  -->\n" +
    "            <i class=\"edit-layer fa fa-pencil\" ng-click=\"panel.show('layerDetail', 'right')\"></i> \n" +
    "          </div>\n" +
    "        </label>\n" +
    "      </div>\n" +
    "      <div style=\"font-size: 9px; color: yellow;\">{{ Drawing.current.layerOutline }}</div>\n" +
    "      <div class=\"bottom-buttons-wrap\">\n" +
    "        <div class=\"bottom-buttons\">\n" +
    "          <i class=\"fa fa-trash trash\" ng-class=\"{\n" +
    "            'hover': overTrash,\n" +
    "            'active': sorting\n" +
    "          }\"></i>\n" +
    "          <i class=\"fa fa-folder active\"></i>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"panel-secondary\" ng-class=\"{\n" +
    "      'active': panel.active == 'layerDetail',\n" +
    "      'transition': panel.transition,\n" +
    "      'staging-right': panel.stagingRight == 'layerDetail',\n" +
    "      'staging-left': panel.stagingLeft == 'layerDetail'\n" +
    "    }\">\n" +
    "      <div class=\"top-wrap\">\n" +
    "        <!-- <i class=\"back fa fa-arrow-left\" ng-click=\"hideSecondary($event)\"></i> -->\n" +
    "        <i class=\"back fa fa-arrow-left\" ng-click=\"panel.show('layers', 'left')\"></i> <h2 class=\"panel-title\">Edit Layer</h2>\n" +
    "      </div>\n" +
    "      <div class=\"title-edit-wrap\">\n" +
    "        <input type=\"text\" class=\"input-dark title-edit\" ng-model=\"Drawing.current.layerCurrent.title\" ng-blur=\"Drawing.current.save()\" />\n" +
    "        <br><br>\n" +
    "      </div>\n" +
    "      <div class=\"attr-detail\">\n" +
    "        <div class=\"half-width-outer\">\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">Opacity:</label><draw-input draw-model=\"Drawing.current.layerCurrent.fillOpacity\" unit=\"%\" on-blur=\"Drawing.current.save()\"></draw-input>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "            <label class=\"attr-label\">Color:</label><button class=\"layer-color\" ng-style=\"{background: Drawing.current.layerCurrent.color}\" ng-click=\"panel.show('colors', 'right'); colorPalette.current.model = Drawing.current.layerCurrent\"></button>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">X:</label><draw-input draw-model=\"Drawing.current.layerCurrent.x\" unit=\"px\" on-blur=\"Drawing.current.save()\"></draw-input>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">Y:</label><draw-input draw-model=\"Drawing.current.layerCurrent.y\" unit=\"px\" on-blur=\"Drawing.current.save()\"></draw-input>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">Width:</label><draw-input draw-model=\"Drawing.current.layerCurrent.width\" unit=\"px\" on-blur=\"Drawing.current.save()\"></draw-input>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">Height:</label><draw-input draw-model=\"Drawing.current.layerCurrent.height\" unit=\"px\" on-blur=\"Drawing.current.save()\"></draw-input>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">Stroke:</label><draw-input draw-model=\"Drawing.current.layerCurrent.stroke.width\" unit=\"px\" on-blur=\"Drawing.current.save()\"></draw-input>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">Str Col:</label><button class=\"layer-color\" ng-style=\"{background: Drawing.current.layerCurrent.stroke.color}\" ng-click=\"panel.show('colors', 'right'); colorPalette.current.model = Drawing.current.layerCurrent.stroke\"></button>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">Radius:</label><draw-input draw-model=\"Drawing.current.layerCurrent.radius\" unit=\"px\" on-blur=\"Drawing.current.save()\"></draw-input>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"panel-colors\" ng-class=\"{\n" +
    "      'active': panel.active == 'colors',\n" +
    "      'transition': panel.transition,\n" +
    "      'staging-right': panel.stagingRight == 'colors',\n" +
    "      'staging-left': panel.stagingLeft == 'colors'\n" +
    "    }\">\n" +
    "      <div class=\"top-wrap\">\n" +
    "        <i class=\"back fa fa-arrow-left\" ng-click=\"panel.show('layerDetail', 'left'); Drawing.current.save()\"></i>  <h2 class=\"panel-title\">Edit Color</h2>\n" +
    "      </div>\n" +
    "      <div class=\"btn-group color-palette\">\n" +
    "      	<!-- {{ colorPalette.current.model }} -->\n" +
    "        <label ng-repeat=\"color in colorPalette.palette\" class=\"btn\" ng-style=\"{background: '{{ color }}'}\" ng-model=\"colorPalette.current.model.color\" btn-radio=\"'{{ color }}'\"></label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("toolbar/toolbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("toolbar/toolbar.tpl.html",
    "<div class=\"toolbar-wrap\" ng-controller=\"ToolbarController\">\n" +
    "	<div class=\"btn-group-vertical\">\n" +
    "	  <label class=\"btn\" ng-model=\"state.tool\" btn-radio=\"'transform'\"><i class=\"fa fa-arrows\"></i></label>\n" +
    "	  <label class=\"btn\" ng-model=\"state.tool\" btn-radio=\"'rectangle'\"><i class=\"fa fa-square\"></i></label>\n" +
    "	  <label class=\"btn\" ng-model=\"state.tool\" btn-radio=\"'oval'\"><i class=\"fa fa-circle\"></i></label>\n" +
    "	  <label class=\"btn\" ng-model=\"state.tool\" btn-radio=\"'text'\"><i class=\"fa fa-font\"></i></label>\n" +
    "	</div>\n" +
    "</div>");
}]);
