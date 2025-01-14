    const colorArray = ['red', 'pink', 'purple', 'deep-purple'];
    const ipc = require('electron').ipcRenderer;
    var todoListSlider = null;
    $(document).ready(function () {
        Helper.initViews();
        colorArray.sort(function() { return 0.5 - Math.random() });
        updateMarkedTodoSlider();
        updateInProgressTodo();
    });



    function updateMarkedTodoSlider(){
        result = App.loadRoute('getMarkedTodoList');
        result = JSON.parse(result);
        if (result.length == 0)
            return;
        template = App.loadRoute('templates', '/views/template/todo-slider-item.html');
        try {
            reloadFlipster();
        }catch (w){

        }
        for (i = 0; i < result.length; i++){
            item = result[i];
            item_temp = $(template);
            item_temp.find("h1").html(item.title);
            item_temp.find("p").html(item.content);
            item_temp.find('section').attr('todo-id', '' + item.id);
            item_temp.find("progressbar").css("width", '' + item.progress + '%');
            if ((i + 1) < colorArray.length){
                item_temp.find("section").attr('class', 'bg-' + colorArray[i]);
            }else{
                item_temp.find("section").attr('class', 'bg-' + colorArray[Math.round(i % colorArray.length)]);
            }
            $("#todo-slider .flip-items").append(item_temp);
        }
        window.currentSliderTODO = Math.round((result.length - 1) / 2);
        todoListSlider = $("#todo-slider").flipster({
            start: window.currentSliderTODO,
            onItemSwitch: onItemSwitchListener
        });
        window.currentSliderTODO = result[currentSliderTODO].id;
    }



    var onItemSwitchListener = function(curr, prev){
        window.currentSliderTODO = $(curr).find('section').attr('todo-id');
    };



    function makeNewTODO(){
        title = $("#todo-title").val();
        content = $("#todo-content").val();
        marked = $("#is_marked").is(':checked');
        data = {
            title : title,
            content : content,
            marked : marked
        };
        if (App.loadRoute('makeNewTODO', JSON.stringify(data)) == 1){
            updateMarkedTodoSlider();
        }
    }


    function openTODO(element){
        openTODOById($(element).parent().parent().attr('todo-id'));
    }


    function openTODOFromSection(element){
        todo_id = $(element).attr('todo-id');
        if (window.currentSliderTODO != todo_id)
            return;

        openTODOById(todo_id);
    }


    function openTODOFromAll(element){
        todo_id = $(element).attr('todo-id');
        openTODOById(todo_id);
    }
    function openTODOById(id){
        App.loadRoute('openTODOModal', id);
    }


    function reloadFlipster(){
        //$("#todo-slider").flipster('destroy');
        $("#todo-slider").replaceWith('<div id="todo-slider" class="todo-slider"> <ul class="flip-items"> </ul> </div>');
    }


    ipc.on('event-close-modal', function () {
        updateMarkedTodoSlider();
    });



    function showAllTodo() {
        $("footer.main-footer").removeClass("small-screen").addClass("full-screen");
        $("#btn-back").fadeIn();
    }

    function hideAllTodo() {
        $("footer.main-footer").removeClass("full-screen").addClass("small-screen");
        $("#btn-back").fadeOut();
    }



    function updateInProgressTodo(){
        result = App.loadRoute('getUnFinishedTodo');
        result = JSON.parse(result);
        if (result.length == 0)
            return;
        template = App.loadRoute('templates', '/views/template/todo-list-section.html');
        $("#all-todo-container").html("");
        for (i = 0; i < result.length; i++){
            item = result[i];
            item_temp = $(template);
            item_temp.find("h1").html(item.title);
            item_temp.find("p").html(item.content);
            item_temp.attr('todo-id', '' + item.id);
            item_temp.find("progressbar").css("width", '' + item.progress + '%');
            if ((i + 1) < colorArray.length){
                item_temp.attr('class', 'bg-' + colorArray[i]);
            }else{
                item_temp.attr('class', 'bg-' + colorArray[Math.round(i % colorArray.length)]);
            }
            $("#all-todo-container").append(item_temp);
        }
        $("#all-todo-container").append('<br><br><h1>--</h1>');
    }



    function updateFinishedTodo(){
        result = App.loadRoute('getFinishedTodo');
        result = JSON.parse(result);
        if (result.length == 0)
            return;
        template = App.loadRoute('templates', '/views/template/todo-list-section.html');
        $("#all-todo-container").html("");
        for (i = 0; i < result.length; i++){
            item = result[i];
            item_temp = $(template);
            item_temp.find("h1").html(item.title);
            item_temp.find("p").html(item.content);
            item_temp.attr('todo-id', '' + item.id);
            item_temp.find("progressbar").css("width", '' + item.progress + '%');
            if ((i + 1) < colorArray.length){
                item_temp.attr('class', 'bg-' + colorArray[i]);
            }else{
                item_temp.attr('class', 'bg-' + colorArray[Math.round(i % colorArray.length)]);
            }
            $("#all-todo-container").append(item_temp);
        }
        $("#all-todo-container").append('<br><br><h1>--</h1>');
    }



    function showInProgressTODO(ele) {
        $("#all-todo-tabs span").removeClass("active");
        $(ele).addClass("active");
        updateInProgressTodo();
    }

    function showFinishedTODO(ele) {
        $("#all-todo-tabs span").removeClass("active");
        $(ele).addClass("active");
        updateFinishedTodo();
    }
