(function (ng, app) {

    "use strict";

    app.controller(
		"chat.ChatController",
		function ($scope, requestContext, _) {

		    // Read current data and rebuild UI.
		    // If you plan to generate complex UIs like this, consider using a JavaScript templating library.
		    function refreshRoomItems() {
		        //var roomQuery = roomItemTable.where({ teacher: false });
		        var roomQuery = roomItemTable;

		        roomQuery.read().then(function (roomItems) {
		            var listRoomItems = $.map(roomItems, function (item) {
		                return $('<li>')
                    .attr('data-roomitem-id', item.id)
                    .append($('<button class="item-delete">Delete</button>'))
                    .append($('<div>').append($('<input class="item-text">').val(item.text)));
		            });

		            $('#room-items').empty().append(listRoomItems).toggle(listRoomItems.length > 0);
		            $('#room-summary').html('<strong>' + roomItems.length + '</strong> room(s)');
		        });
		    }

		    function getRoomItemId(formElement) {
		        return Number($(formElement).closest('li').attr('data-roomitem-id'));
		    }

		    // Handle insert
		    $('#add-room-item').submit(function (evt) {
		        var roomTextbox = $('#new-room-item-text'),
                roomItemText = roomTextbox.val();
		        if (roomItemText !== '') {
		            roomItemTable.insert({ text: roomItemText }).then(refreshRoomItems);
		        }
		        roomTextbox.val('').focus();
		        evt.preventDefault();
		    });

		    // Handle update
		    $(document.body).on('change', '.item-text', function () {
		        var newText = $(this).val();
		        roomItemTable.update({ id: getRoomItemId(this), text: newText });
		    });

		    // Handle delete
		    $(document.body).on('click', '.item-delete', function () {
		        roomItemTable.del({ id: getRoomItemId(this) }).then(refreshRoomItems);
		    });

		    // --- Define Controller Methods. ------------------- //

		    // ...

		    // --- Define Scope Methods. ------------------------ //

		    // ...

		    // --- Define Controller Variables. ----------------- //

		    // Get the render context local to this controller (and relevant params).
		    var renderContext = requestContext.getRenderContext("standard.chat");

		    // --- Define Scope Variables. ---------------------- //

		    // The subview indicates which view is going to be rendered on the page.
		    $scope.subview = renderContext.getNextSection();

		    // --- Bind To Scope Events. ------------------------ //

		    // I handle changes to the request context.
		    $scope.$on(
				"requestContextChanged",
				function () {
				    // Make sure this change is relevant to this controller.
				    if (!renderContext.isChangeRelevant()) {
				        return;
				    }

				    // Update the view that is being rendered.
				    $scope.subview = renderContext.getNextSection();
				}
			);

		    // --- Initialize. ---------------------------------- //

		    $scope.setWindowTitle("Chat");
		    refreshRoomItems();
		}
	);

})(angular, Intlec);