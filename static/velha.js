/* jogo_ia/static/velha.js */
let board = ["","","","","","","","",""];
let human = "X";
let ai = "O";
const boardDiv = document.getElementById("board");

function draw(){
    boardDiv.innerHTML="";
    for(let i=0;i<9;i++){
        let cell=document.createElement("div");
        cell.className="cell";
        cell.innerText=board[i];
        
        if(board[i] === "X") cell.style.color = "#d63031";
        if(board[i] === "O") cell.style.color = "#0984e3";

        cell.onclick=()=>play(i);
        boardDiv.appendChild(cell);
    }
}

function play(i){
    if(board[i]!="") return;
    board[i]=human;
    draw();

    setTimeout(()=>{
        if(checkWin(board,human)){
            alert("Você venceu!");
            reset();
            return;
        }
        if(isFull(board)){
            alert("Empate!");
            reset();
            return;
        }
        aiMove();
    }, 100);
}

function aiMove(){
    let dif = document.getElementById("dificuldade").value;
    let move;

    if (dif === "facil") {
        move = randomMove();
    } else if (dif === "medio") {
        if (Math.random() < 0.5) {
            move = bestMove();
        } else {
            move = randomMove();
        }
    } else {
        move = bestMove();
    }
    
    if(move !== undefined) {
        board[move]=ai;
        draw();

        setTimeout(()=>{
            if(checkWin(board,ai)){
                alert("IA venceu!");
                reset();
            } else if(isFull(board)){
                alert("Empate!");
                reset();
            }
        }, 100);
    }
}

function randomMove() {
    let available = [];
    for(let i=0; i<9; i++){
        if(board[i] === "") available.push(i);
    }
    if(available.length > 0) {
        let randomIndex = Math.floor(Math.random() * available.length);
        return available[randomIndex];
    }
}

function bestMove() {
    let bestScore=-Infinity;
    let move;
    for(let i=0;i<9;i++){
        if(board[i]==""){
            board[i]=ai;
            let score=minimax(board, 0, false);
            board[i]="";
            if(score>bestScore){
                bestScore=score;
                move=i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing){
    if(checkWin(board,ai)) return 10 - depth;
    if(checkWin(board,human)) return depth - 10;
    if(isFull(board)) return 0;

    if(isMaximizing){
        let bestScore=-Infinity;
        for(let i=0;i<9;i++){
            if(board[i]==""){
                board[i]=ai;
                let score=minimax(board, depth + 1, false);
                board[i]="";
                bestScore=Math.max(score,bestScore);
            }
        }
        return bestScore;
    }else{
        let bestScore=Infinity;
        for(let i=0;i<9;i++){
            if(board[i]==""){
                board[i]=human;
                let score=minimax(board, depth + 1, true);
                board[i]="";
                bestScore=Math.min(score,bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin(b,p){
    let wins=[
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return wins.some(c=>c.every(i=>b[i]==p));
}

function isFull(b){
    return b.every(c=>c!="");
}

function reset(){
    board=["","","","","","","","",""];
    draw();
}

draw();