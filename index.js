//Criando as constantes:
const taskInput = document.querySelector(".task-input input")
const filters = document.querySelectorAll(".filters span")
const clearAll = document.querySelector(".clear-btn")
const taskBox = document.querySelector(".task-box")

//Pegando dados do localStorage e transformando em objs Javascritp e atribuindo a variavel toDo
let toDo = JSON.parse(localStorage.getItem("to-do-list"))

//Criando variaveis (valores que precisam/podem mudar logo não podem ser constantes):
let editId = false
let isEditTask = false

/*O código abaixo adiciona um evento de clique a cada botão e executa algumas ações, no caso ele está trocando a classe
active de um botão para outro quando for clicado. Também tem a chamada de uma função para exibir uma lista de itens com base 
no botão clicado. */
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active")
        btn.classList.add("active")
        showList(btn.id)
    });
});

//Exibindo o Horário atual
function showCurrentTime(){
    // Define a variável currentTime como a hora atual
    var currentTime = new Date()
    var fCurrentTime = currentTime.toLocaleDateString()

    // Obtém as horas, minutos e segundos atuais
    var hour = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()
  
    // Formata a hora com dois dígitos
    if (hour < 10) hour = "0" + hour
    if (minutes < 10) minutes = "0" + minutes
    if (seconds < 10) seconds = "0" + seconds
  
    // Atualiza o elemento HTML com a hora atual
    var time = document.querySelector(".dateTime")
    var date = document.querySelector(".currentDate")
    date.innerHTML = fCurrentTime
    time.innerHTML = hour + ":" + minutes + ":" + seconds
}
  
// Chama a função showCurrentTime a cada 1 segundo
setInterval(showCurrentTime, 1000)
let dragItem = null


//Função para mostrar a lista ao úsuario.
function showList(filter) {
    //Inicializando abaixo uma string vazia para armazenar o HTML da lista de tarefas.
    let liTag = ""

    //Verifica se a variável toDo existe
    if (toDo) {
        toDo.forEach((todo, id) => {

            /*Verificando abaixo se a propriedade status do objeto de tarefa atual é igual a "completado". 
            Se for, a string "checado" é atribuída à variável completado; caso contrário, a string vazia é atribuída. */
            let completed = todo.status == "completed" ? "checked" : ""

            /*Verificando abaixo se o argumento filtro é igual ao valor da propriedade status da tarefa atual ou se filtro é 
            igual a "all". */
            if (filter == todo.status || filter == "all") {
                //A template string formatada contém o HTML para exibir uma única tarefa
                liTag += `<li class="task" draggable="true" id="${id}">
                    <label for="${id}">
                        <input onclick="attStatus(this)" type="checkbox" id="${id}" ${completed}>
                        <p class="${completed}">${todo.name}</p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-setting"></i>
                        <ul class="task-menu">
                            <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Editar</li>
                            <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash-alt"></i>Apagar</li>
                        </ul>
                    </div>
                </li>`
            }
        })
    }

    /*Define abaixo o conteúdo HTML do elemento taskBox como o valor da variável liTag. Se liTag estiver vazio, 
    será exibida uma mensagem indicando que não há tarefas. */
    taskBox.innerHTML = liTag || `<span>Você ainda não tem tarefas</span>`

    let checkTask = taskBox.querySelectorAll(".task")

    /*Abaixo verifica se o comprimento da variável checarTarefa é igual a zero. Se for, a classe "active" é 
    removida do elemento limparTudo caso contrário, a classe "active" é adicionada */
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active")

    /*Isso verifica se a altura do elemento taskBox é maior ou igual a 300 pixels. Se for, a classe "overflow" é 
    adicionada ao elemento taskBox caso contrário, a classe "overflow" é removida. Essa classe é usada para exibir 
    uma barra de rolagem quando a altura do elemento taskBox*/ 
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow")

    // Adicione os eventos dragstart e dragend em cada tarefa
    checkTask.forEach((task) => {
        task.setAttribute("draggable", "true");
        task.addEventListener("dragstart", handleDragStart)
        task.addEventListener("dragend", handleDragEnd)
    })
    
    // Adicione o evento dragover e drop em cada tarefa
    taskBox.addEventListener("dragover", handleDragOver)
    taskBox.addEventListener("drop", handleDrop)

    /*A função handleDragStart é chamada quando um elemento começa a ser arrastado e configura o tipo de dado que 
    está sendo arrastado (text/plain) e o efeito permitido (move). Também adiciona a classe dragging ao elemento 
    arrastado para que ele possa ser estilizado enquanto está sendo arrastado.*/ 
    function handleDragStart(e) {
        e.dataTransfer.setData("text/plain", e.target.id)
        e.dataTransfer.effectAllowed = "move"
        e.target.classList.add("dragging")
    }
      
    /*A função handleDragEnd é chamada quando o arrastar é encerrado, remove a classe dragging do elemento arrastado */
    function handleDragEnd(e) {
        e.target.classList.remove("dragging")
    }
      
    /*A função handleDragOver é chamada enquanto um elemento está sendo arrastado sobre a área de soltura e é usada
    para indicar que um elemento pode ser solto naquela área.*/
    function handleDragOver(e) {
        e.preventDefault()
    }
    
    /*A função handleDrop é chamada quando um elemento é solto sobre a área de soltura. Ela impede o comportamento
    padrão do navegador de recarregar a página e, em seguida, obtém o ID do elemento arrastado. O elemento é 
    movido para a nova posição usando o método insertBefore do elemento taskBox. */
    function handleDrop(e) {
        e.preventDefault()
        const draggedId = e.dataTransfer.getData("text/plain")
        const draggedEl = document.getElementById(draggedId)
        const dropzone = e.target.closest(".task")
        if (dropzone && dropzone !== draggedEl) {
          taskBox.insertBefore(draggedEl, dropzone)
    }
}
    
}

/*O parâmetro tarefaSelecionada representa o ícone "..." que foi clicado. A partir dele, é possível encontrar o 
elemento HTML que contém o menu de opções. Isso é feito usando a propriedade parentElement para acessar o elemento 
pai do ícone e, em seguida, a propriedade lastElementChild para acessar o último elemento filho desse elemento pai.*/
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild

    /*Com o elemento que contém o menu de opções identificado, a classe show é adicionada a ele, o que faz com que ele seja exibido.*/
    menuDiv.classList.add("show")
    document.addEventListener("click", e => {
        //Verificando se o elemento clicado não é um ícone ou se não é o elemento tarefaSelecionada clicado.
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show")
        }
    })
}

/*A seguir a função responsável por remover uma tarefa da lista de tarefas armazenadas no localStorage e 
atualizar a visualização das tarefas na tela*/ 
function deleteTask(deleteId, filter) {

    //Atribuindo o valor falso para garantir que não está editando 
    isEditTask = false

    //Deletando a tarefa
    toDo.splice(deleteId, 1)

    //atualizando o localStorage com o novo array toDo, que não contém mais a tarefa removida.
    localStorage.setItem("to-do-list", JSON.stringify(toDo))

    //chamando novamente a função mostrarLista()
    showList(filter)
}

//Função para atualizar o status da tarefa 
function attStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild
    //Verificando se a propriedade checked do checkbox é verdadeira, o que significa que ele foi marcado
    if (selectedTask.checked) {

        //Adicionando a classe "checada" ao nomeTarefa, para que ele seja exibido como concluído.
        taskName.classList.add("checked")

        //Atualizando o status da tarefa toDo como "completado".
        toDo[selectedTask.id].status = "completed"
    } else {

        //Removendo a classe "checada" do nomeTarefa, para que ele seja exibido como pendente.
        taskName.classList.remove("checked")

        //Atualiza o status da tarefa na matriz toDo como "pendente".
        toDo[selectedTask.id].status = "pending"
    }

    //Armazenando a variavel toDo atualizada no localStorage.
    localStorage.setItem("to-do-list", JSON.stringify(toDo))
}

//função para editar uma tarefaS
function editTask(taskId, textName) {

    //Essa variável será usada para identificar a tarefa que está sendo editada.
    editId = taskId

    /*Atribuindo o valor true à variável isEditTask. Essa variável indica que uma tarefa está sendo editada e 
    será usada para definir o comportamento do botão de adicionar tarefa. */
    isEditTask = true
    
    //Novo valor sendo atribuido 
    taskInput.value = textName

    /*Usando a função focus() para colocar o foco no input inputTarefa, permitindo que o usuário possa editar o 
    texto da tarefa.*/
    taskInput.focus()

    /*Adicionando a classe active ao input inputTarefa. Essa classe é usada para destacar o input que está sendo 
    editado, tornando-o mais visível para o usuário */
    taskInput.classList.add("active")
}

//Função para apagar toda a lista
clearAll.addEventListener("click", () => {

    //Atribuindo o valor falso para garantir que não está editando 
    isEditTask = false

    //A função usa o método "splice" para remover todos os elementos do array "toDo" a partir da posição 0
    toDo.splice(0, toDo.length)

    //Atualizando o "localStorage" com o novo estado da lista de tarefas
    localStorage.setItem("to-do-list", JSON.stringify(toDo))

    //Chamando novamente a função mostrarLista()
    showList()
});

taskInput.addEventListener("keyup", e => {

    /*O texto digitado pelo usuário é armazenado na variável usuarioTarefa após remover os espaços em branco do 
    início e do fim do texto com o método trim().*/
    let userTask = taskInput.value.trim()

    /*Se a tecla pressionada for Enter e o texto digitado pelo usuário não for vazio, a função verifica se 
    editarTarefa é falso.*/
    if (e.key == "Enter" && userTask) {
        if (!isEditTask) {
            toDo = !toDo ? [] : toDo

            //A função cria um objeto tarefaInfo com as informações da tarefa e adiciona esse objeto ao array toDo
            let taskInfo = { name: userTask, status: "pending" }
            toDo.push(taskInfo)
        } else {
            isEditTask = false
            toDo[editId].name = userTask
        }

        //Voltando o valor do inputTarefa para vazio
        taskInput.value = ""

        //Atualizando o localStorage com o novo array e chamando a função showList mais uma vez
        localStorage.setItem("to-do-list", JSON.stringify(toDo))
        showList(document.querySelector("span.active").id)
    }
})
