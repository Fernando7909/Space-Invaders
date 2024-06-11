document.addEventListener('DOMContentLoaded', () => {
    // Selección de elementos del DOM
    const grid = document.querySelector(".grid");
    const resultDisplay = document.querySelector(".results");
    const startButton = document.querySelector('#start-button');

    // Declaración de variables globales
    let currentShooterIndex;
    const width = 20; //********** */
    let alienInvaders;
    let aliensRemoved;
    let invadersId;
    let isGoingRight;
    let direction = 1;
    let results = 0;
    let gameOver;
    let squares; // Asegúrate  =de declarar squares aquí para que sea accesible en todas las funciones

    //****************************************** */
    // Inicialización de las variables del juego
    function initializeGameVariables() {
        currentShooterIndex = 390; // Posición inicial del tirador
        alienInvaders = [   //*************************************** */
            3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
            63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76
        ]; // Posiciones iniciales de los invasores alienígenas

        aliensRemoved = []; // Array para almacenar los aliens eliminados
        isGoingRight = true; // Dirección inicial de movimiento de los aliens
        direction = 1; // Dirección de movimiento (1 = derecha, -1 = izquierda)
        results = 0; // Puntuación inicial
        gameOver = false; // Estado del juego
        resultDisplay.innerHTML = results; // Actualizar la puntuación en pantalla
    }

    //********************************************* */
    // Crear la cuadrícula del juego
    function createGrid() {
        grid.innerHTML = ''; // Limpiar la cuadrícula existente
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            grid.appendChild(square); // Añadir cada celda a la cuadrícula
        }
        squares = Array.from(document.querySelectorAll(".grid div")); // Seleccionar todas las celdas de la cuadrícula
    }

    // Dibujar los invasores en la cuadrícula
    function draw() {
        for (let i = 0; i < alienInvaders.length; i++) {
            if (!aliensRemoved.includes(i)) {
                squares[alienInvaders[i]].classList.add("invader"); // Añadir clase invader a las celdas de los invasores
            }
        }
    }

    // Eliminar los invasores de la cuadrícula
    function remove() {
        for (let i = 0; i < alienInvaders.length; i++) {
            squares[alienInvaders[i]].classList.remove("invader"); // Quitar clase invader de las celdas de los invasores
        }
    }
    //********************** */
    // Mover el tirador
    function moveShooter(e) {
        if (!gameOver) {
            squares[currentShooterIndex].classList.remove("shooter"); // Quitar clase shooter de la celda actual
            switch (e.key) {
                case "ArrowLeft":
                    if (currentShooterIndex % width !== 0) currentShooterIndex -= 1; // Mover a la izquierda si no está en el borde izquierdo
                    break;
                case "ArrowRight":
                    if (currentShooterIndex % width < width - 1) currentShooterIndex += 1; // Mover a la derecha si no está en el borde derecho
                    break;
            }
            squares[currentShooterIndex].classList.add("shooter"); // Añadir clase shooter a la nueva celda
        }
    }

    // Escuchar eventos de teclado para mover el tirador
    document.addEventListener("keydown", moveShooter);

    // Mover los invasores
    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
        remove();

        if (rightEdge && isGoingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width; // Mover hacia abajo
                direction = -1;
                isGoingRight = false;
            }
        }

        if (leftEdge && !isGoingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width; // Mover hacia abajo
                direction = 1;
                isGoingRight = true;
            }
        }

        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += direction; // Mover invasores en la dirección actual
        }

        draw();

        // Verificar si los invasores alcanzaron al tirador
        if (squares[currentShooterIndex].classList.contains("invader")) {
            resultDisplay.innerHTML = "GAME OVER";
            clearInterval(invadersId);
            gameOver = true;
        }
        //************************************************************************* */
        // Verificar si los invasores han alcanzado la parte inferior de la cuadrícula
        for (let i = 0; i < alienInvaders.length; i++) {
            if (alienInvaders[i] >= (width * width) - width) {
                resultDisplay.innerHTML = "GAME OVER";
                clearInterval(invadersId);
                gameOver = true;
                return;
            }
        }

        // Verificar si todos los invasores han sido eliminados
        if (aliensRemoved.length === alienInvaders.length) {
            resultDisplay.innerHTML = "YOU WIN";
            clearInterval(invadersId);
            gameOver = true;
        }
    }

    // Disparar un láser
    function shoot(e) {
        if (e.key === "ArrowUp" && !gameOver) {
            let laserId;
            let currentLaserIndex = currentShooterIndex;

            function moveLaser() {
                squares[currentLaserIndex].classList.remove("laser");
                currentLaserIndex = currentLaserIndex - width; // Mover el láser hacia arriba reduciendo el índice por el ancho
                if (currentLaserIndex < 0) {
                    clearInterval(laserId); // Si el láser está fuera de la cuadrícula, detenerlo
                    return;
                }
                squares[currentLaserIndex].classList.add("laser");

                if (squares[currentLaserIndex].classList.contains("invader")) {
                    squares[currentLaserIndex].classList.remove("laser");
                    squares[currentLaserIndex].classList.remove("invader");
                    squares[currentLaserIndex].classList.add("boom");

                    setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300);
                    clearInterval(laserId);

                    const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
                    aliensRemoved.push(alienRemoved);
                    results++;
                    resultDisplay.innerHTML = results;
                }
            }

            laserId = setInterval(moveLaser, 100);
        }
    }

    // Escuchar eventos de teclado para disparar el láser
    document.addEventListener('keydown', shoot);

    //******************************* */
    // Iniciar el juego
    function startGame() {
        clearInterval(invadersId); // Detener el juego anterior si existe
        createGrid(); // Crear la cuadrícula del juego
        initializeGameVariables(); // Inicializar las variables del juego
        draw(); // Dibujar los invasores
        squares[currentShooterIndex].classList.add("shooter"); // Añadir clase shooter a la celda del tirador
        invadersId = setInterval(moveInvaders, 750); // Empezar a mover los invasores
    }
    //***************************************************************** */
    // Escuchar eventos de clic en el botón de inicio para iniciar el juego
    startButton.addEventListener('click', startGame);
});
