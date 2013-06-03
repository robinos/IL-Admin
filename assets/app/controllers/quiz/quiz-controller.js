// ----------------------------------------------------------------------------
// Page viewmodel
(function (ng, app) {

    "use strict";

    app.controller(
		"quiz.QuizController",
		function ($scope, requestContext, _) {

		    // Read current data and rebuild UI.
		    // If you plan to generate complex UIs like this, consider using a JavaScript templating library.
		    function refreshQuizItems() {
		        //var query = quizItemTable.where({ teacher: false });
		        var quizQuery = quizItemTable;

		        quizQuery.read().then(function (quizItems) {
		            var listQuizItems = $.map(quizItems, function (item) {
		                return $('<li>')
                    .attr('data-quizitem-id', item.id)
                    .append($('<button class="item-delete">Delete</button>'))
                    .append($('<div>').append($('<input class="item-text">').val(item.text)));
		            });

		            $('#quiz-items').empty().append(listQuizItems).toggle(listQuizItems.length > 0);
		            $('#quiz-summary').html('<strong>' + quizItems.length + '</strong> quiz item(s)');
		        });
		    }

		    function getQuizItemId(formElement) {
		        return Number($(formElement).closest('li').attr('data-quizitem-id'));
		    }

		    // Handle insert
		    $('#add-quiz-item').submit(function (evt) {
		        var quizTextbox = $('#new-quiz-item-text'),
                quizItemText = quizTextbox.val();
		        if (quizItemText !== '') {
		            quizItemTable.insert({ text: quizItemText }).then(refreshQuizItems);
		        }
		        quizTextbox.val('').focus();
		        evt.preventDefault();
		    });

		    // Handle update
		    $(document.body).on('change', '.item-text', function () {
		        var newText = $(this).val();
		        quizItemTable.update({ id: getQuizItemId(this), text: newText });
		    });

		    // Handle delete
		    $(document.body).on('click', '.item-delete', function () {
		        quizItemTable.del({ id: getQuizItemId(this) }).then(refreshQuizItems);
		    });

		    // --- Define Controller Methods. ------------------- //

		    // ...

		    // --- Define Scope Methods. ------------------------ //

		    // ...

		    // --- Define Controller Variables. ----------------- //

		    // Get the render context local to this controller (and relevant params).
		    var renderContext = requestContext.getRenderContext("standard.quiz");

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

		    $scope.setWindowTitle("Quiz");
		    refreshQuizItems();
		}
	);

})(angular, Intlec);