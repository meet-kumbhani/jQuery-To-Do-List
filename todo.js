
$(document).ready(function () {

     function addTodo() {
          let todo = $("#inputtext").val().trim();
          if (todo === "") {
               alert("Enter Something");
               return;
          }

          // Add items

          let todoText = $('<p><span class="three-state-toggle mb-3 me-2"><input type="button" class="toggle-buttton pending-btn" value="Pending" style="background-color: red;"><input type="button" class="toggle-buttton ongoing-btn" value="On"><input type="button" class="toggle-buttton done-btn" value="Done"></span> <span class="todo-item"> ' + todo + ' </span><span id="stop-watch" class="ms-auto">0:0:0</span></p>');
          let editButton = $('<button class="btn btn-success btn-sm ms-auto edit-btn">Edit</button>');
          let deleteButton = $('<button class="btn btn-danger btn-sm ms-3">Delete</button>');

          todoText.data("startTime", null);
          todoText.data("endTime", null);
          todoText.data("timeout", null);

          todoText.append(editButton, deleteButton);
          $("#todotext").append(todoText);

          saveItemToLocalStorage();
          $("#inputtext").val("");

     }

     //Stop Watch

     $(document).on("click", ".ongoing-btn", function () {
          let startTime = moment();
          updateStopwatch($(this), startTime);
     });

     function updateStopwatch(element, startTime) {
          let timeout = setTimeout(function () {
               if (startTime) {
                    let currentTime = moment();
                    let totaltime = currentTime.diff(startTime, 'hh:mm:ss A');
                    let duration = moment.duration(totaltime);

                    let hours = Math.floor(duration.asHours());
                    let minutes = Math.floor(duration.asMinutes()) % 60;
                    let seconds = Math.floor(duration.asSeconds()) % 60;

                    element.closest("p").find('#stop-watch').text(`${hours}:${minutes}:${seconds}`);
                    element.closest("p").data("endTime", moment().format('hh:mm:ss A'));
                    updateStopwatch(element, startTime);
                    saveItemToLocalStorage()
               }
          }, 1000);

          element.closest("p").data("startTime", startTime);
          element.closest("p").data("timeout", timeout);
     }

     $(document).on("click", ".done-btn", function () {
          clearTimeout($(this).closest("p").data("timeout"));
          $(this).closest("p").data("startTime");
     });

     $(document).on("click", ".pending-btn", function () {
          clearTimeout($(this).closest("p").data("timeout"));
          resetStopwatch($(this));
          $(this).closest("p").data("startTime", null);
     });

     function resetStopwatch(element) {
          element.closest("p").find('#stop-watch').text("0:0:0");
     }

     //Delete items

     $("#todotext").on("click", ".btn-danger", function () {
          let removeitem = $(this).parent();
          swal({
               title: "Are you sure?",
               text: "Once deleted, you will not be able to recover this Task!",
               icon: "warning",
               buttons: true,
               dangerMode: true,
               closeOnClickOutside: false
          })
               .then((willDelete) => {
                    if (willDelete) {
                         removeitem.remove();
                         swal("Your Task has been deleted!", {
                              icon: "success",
                         });
                    } else {
                         swal("Your Task is safe!");
                    }
                    saveItemToLocalStorage();
               });
     });

     // strike

     $(document).on("click", ".done-btn", function () {
          $(this).closest("p").find('.todo-item').addClass("strike", "yellow").css({ "color": "gray" });
          saveItemToLocalStorage();
     });

     $(document).on("click", ".ongoing-btn, .pending-btn", function () {
          $(this).closest("p").find('.todo-item').removeClass("strike").css({ "color": "white" });
          saveItemToLocalStorage();
     });

     // Color change button

     $(document).on("click", ".pending-btn", function () {
          $(this).css({ "background-color": "red" });
          $(this).closest("p").find(".ongoing-btn, .done-btn").css({ "background-color": "black" });
          saveItemToLocalStorage();
     });

     $(document).on("click", ".ongoing-btn", function () {
          $(this).css({ "background-color": "orange" });
          $(this).closest("p").find(".pending-btn, .done-btn").css({ "background-color": "black" });
          saveItemToLocalStorage();
     });

     $(document).on("click", ".done-btn", function () {
          $(this).css({ "background-color": "green" });
          $(this).closest("p").find(".pending-btn, .ongoing-btn").css({ "background-color": "black" });
          saveItemToLocalStorage();
     });


     // Edit items

     $("#todotext").on("click", ".edit-btn", function () {
          let todoText = $(this).closest("p");
          let currentText = todoText.find("span").text().trim();

          todoText.html('<span class="three-state-toggle mb-3 me-2"><input type="button" class="toggle-buttton pending-btn" value="Pending"><input type="button" class="toggle-buttton ongoing-btn" value="On"><input type="button" class="toggle-buttton done-btn" value="Done"></span> ' +
               '<input type="text" class="edit-input" value="' + currentText + '"> ' +
               '<button class="btn btn-success btn-sm ms-auto save-btn">Save</button>');

          $(".edit-input").focus();
     });

     $("#todotext").on("click", ".save-btn", function () {
          let editedText = $(this).prev('.edit-input').val();
          let todoText = $(this).closest('p');

          todoText.html('<span class="three-state-toggle mb-3 me-2"><input type="button" class="toggle-buttton pending-btn" value="Pending"><input type="button" class="toggle-buttton ongoing-btn" value="On"><input type="button" class="toggle-buttton done-btn" value="Done"></span> <span class="todo-item"> ' + editedText + '</span><span id="stop-watch" class="ms-auto"0:0:0</span>' +
               '<button class="btn btn-success btn-sm ms-auto edit-btn">Edit</button>' +
               '<button class="btn btn-danger btn-sm ms-3">Delete</button>');

          $(document).on("click", ".done-btn", function () {
               $(".todo-item").addClass("strike").css({ "color": "gray" })

          });

          saveItemToLocalStorage();

     });


     // Delete all Items

     $("#clearall").click(function () {
          $("#todotext").empty();
          saveItemToLocalStorage();
     })


     $("#addbutton").click(addTodo);

     getItems();

     // Save item To LocalStorage

     function saveItemToLocalStorage() {
          let todos = [];

          $("#todotext p").each(function () {
               let isPending = $(this).find('.pending-btn').css("background-color") === "rgb(255, 0, 0)";
               let isOngoing = $(this).find('.ongoing-btn').css("background-color") === "rgb(255, 165, 0)";
               let isDone = $(this).find('.done-btn').css("background-color") === "rgb(0, 128, 0)";
               let startTime = $(this).data("startTime");
               let endTime = $(this).data("endTime");
               let timerValue = $(this).find('#stop-watch').text();

               if (isOngoing === true && startTime === null) {
                    startTime = moment().valueOf();
               }

               if (isDone === true && endTime === null) {
                    endTime = moment().format('hh:mm:ss A');
               }

               let duration = Duration($(this).data("startTime"), $(this).data("endTime"));
               document.getElementById("stop-watch").innerHTML = duration

               todos.push({
                    text: $(this).find('.todo-item').text().trim(),
                    isPending: isPending,
                    isOngoing: isOngoing,
                    isDone: isDone,
                    endTime: endTime,
                    startTime: moment(startTime).format('hh:mm:ss A'),
                    duration: duration,
                    timerValue: timerValue
               });
          });

          localStorage.setItem("items", JSON.stringify(todos));
     }

     function Duration(startTime, endTime) {
          if (startTime && endTime) {
               let start = moment(startTime);
               let end = moment(endTime, 'hh:mm:ss A');

               let duration = end.diff(start, 'seconds');
               if (duration < 0) {
                    return "0:0:0";
               }

               let hours = Math.floor(duration / 3600);
               let minutes = Math.floor((duration % 3600) / 60);
               let seconds = duration % 60;

               return `${hours}:${minutes}:${seconds}`
          }
          return "0:0:0";
     }


     //Get items

     function getItems() {
          let storedTodos = JSON.parse(localStorage.getItem('items'));

          if (storedTodos) {
               let todos = storedTodos;

               todos.forEach(todo => {
                    let todoText = $('<p><span class="three-state-toggle mb-3 me-2"><input type="button" class="toggle-buttton pending-btn" value="Pending"><input type="button" class="toggle-buttton ongoing-btn" value="On"><input type="button" class="toggle-buttton done-btn" value="Done"></span> <span class="todo-item"> ' + todo.text + ' </span><span id="stop-watch" class="ms-auto">' + todo.duration + '</span></p>');
                    let editButton = $('<button class="btn btn-success btn-sm ms-auto edit-btn">Edit</button>');
                    let deleteButton = $('<button class="btn btn-danger btn-sm ms-3">Delete</button>');
                    if (todo.isPending) {
                         todoText.find('.pending-btn').css({ "background-color": "red" });
                         todoText.find("#stop-watch").text("0:0:0")
                    }

                    if (todo.isOngoing) {
                         todoText.find('.ongoing-btn').css({ "background-color": "orange" });
                         let startTime = new Date().getTime() - timerfunction(todo.timerValue);
                         updateStopwatch(todoText.find('.ongoing-btn'), startTime);
                    }
                    if (todo.isDone) {
                         todoText.find('.done-btn').css({ "background-color": "green" });
                         todoText.find('.todo-item').addClass('strike').css({ "color": "gray" });
                    }
                    if (todo.timerValue) {
                         todoText.find('#stop-watch').text(todo.timerValue);
                    }

                    todoText.append(editButton, deleteButton);
                    $("#todotext").append(todoText);
               });
          }
     }

     function timerfunction(timerValue) {
          let [hours, minutes, seconds] = timerValue.split(':');
          return (parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)) * 1000;
     }

     //Filter

     $("#allitems").addClass("active");

     $(".tri-state-toggle-button").click(function () {
          $(".tri-state-toggle-button").removeClass("active");
          var id = $(this).attr('id');
          $("#" + id).addClass("active");


          $("#allitems").click(function () {
               $("p").show();
          });

          $("#pendingbtn").click(function (isPending) {
               $("p").each(function () {
                    if (!$(this).find('.done-btn').closest('p').find('.todo-item').hasClass('strike')) {
                         $(this).show();
                    } else {

                         if (isPending === true) {

                              $(this).show();
                         } else {
                              $(this).hide();

                         }

                    }
               });
          });


          $("#ongoingbtn").click(function (isOngoing) {
               $("p").each(function () {
                    if ($(this).find('.ongoing-btn').closest('p').find('.todo-item').hasClass('strike')) {
                         $(this).hide();
                    } else {
                         if (isOngoing === true) {
                              $(this).show();
                         } else {
                              $(this).hide();
                         }
                    }
               });
          });


          $("#completebtn").click(function () {
               $("p").each(function () {
                    if ($(this).find('.todo-item').hasClass('strike')) {
                         $(this).show();
                    } else {
                         $(this).hide();
                    }
               });
          });



     });

});