(function () {
	"use strict";

	var treeviewMenu = $('.app-menu');

	// Toggle Sidebar
	$('[data-toggle="sidebar"]').click(function(event) {
		event.preventDefault();
		$('.app').toggleClass('sidenav-toggled');
	});

	// Activate sidebar treeview toggle
	$("[data-toggle='treeview']").click(function(event) {
		event.preventDefault();
		if(!$(this).parent().hasClass('is-expanded')) {
			treeviewMenu.find("[data-toggle='treeview']").parent().removeClass('is-expanded');
		}
		$(this).parent().toggleClass('is-expanded');
	});

	// Set initial active toggle
	$("[data-toggle='treeview.'].is-expanded").parent().toggleClass('is-expanded');

	//Activate bootstrip tooltips
	$("[data-toggle='tooltip']").tooltip();

})();

$(document).ready(() => {
 
$('.menu-delete').on('click', (e) => {
	$target = $(e.target);
		$.ajax({
			type: 'DELETE',
			url: '/menu/delete/'+$target.attr('data-menu-id'),
			success: (response) => {
				alert('Menu Removed');
				window.location.href='/'
			},
			error: (error) => {
				console.log(error);
			}
		});

});

$('.category-delete').on('click', (e) => {
	$target = $(e.target);
		$.ajax({
			type: 'DELETE',
			url: '/category/delete/'+$target.attr('data-cat-id'),
			success: (response) => {
				alert('Category Removed');
				window.location.href='/'
			},
			error: (error) => {
				console.log(error);
			}
		});

  });

});
