let blackjackGame = {
    'you': {'scoreSpan': '#your-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-result', 'div': '#dealer-box', 'score': 0},
    'cards' : ['2','3','4', '5', '6', '7', '8', '9', '10', 'J','Q', 'K', 'A'],
    'cardMap': {'2': 2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'J':10,'Q':10, 'K':10, 'A':[1,11]},
    'wins': 0,
    'losses' :0,
    'draws' : 0,
    'isStand': false,
    'turnsOver' : false,
};

const YOU=blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
// const R_CARD= blackjackGame['cards'];
const C_MAP= blackjackGame['cardMap'];

const hitSound= new Audio('sounds/swish.m4a');

const winSound = new Audio('sounds/cash.mp3');

const lossSound = new Audio('sounds/aww.mp3');

document.querySelector('#b1').addEventListener('click', blackjackHit);

document.querySelector('#b2').addEventListener('click', dealerLogic);

document.querySelector('#b3').addEventListener('click', blackjackDeal);

function blackjackHit(){
    if(blackjackGame['isStand']== false){

        let card=randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        
        showScore(YOU);
        console.log(YOU['score']);
    }


}
function updateScore(card, activePlayer){
    
    if(card == 'A'){
        // choosing the value of ace
        if(activePlayer['score'] + blackjackGame['cardMap'][card][1] <= 21){
            activePlayer['score'] += blackjackGame['cardMap'][card][1];
        }
        else{
            activePlayer['score'] += blackjackGame['cardMap'][card][0];
        }
    }
    else if(blackjackGame['turnsOver']== false){

        activePlayer['score'] += blackjackGame['cardMap'][card];
    }


}

function showScore(activePlayer){
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';

    }
    else{
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function randomCard(){
    let randIndex=Math.floor(Math.random()*13);
    return blackjackGame['cards'][randIndex];
}

function showCard(card, activePlayer){

    if(activePlayer['score']<=21){

        let cardImage=document.createElement('img');
        // cardImage.style.width = '120px';
        // cardImage.style.height = '158px';
        cardImage.src=`images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
    

}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function dealerLogic(){
    blackjackGame['isStand']= true;

    while(DEALER['score'] < 16 && blackjackGame['isStand'] == true){


        let card=randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }

    
    blackjackGame['turnsOver']=true;
    let winner= decideWinner();
    showResult(winner);
    
    // console.log(blackjackGame['turnsOver']);
}


function blackjackDeal(){


    // showResult(decideWinner());

    if(blackjackGame['turnsOver']==true){

        blackjackGame['isStand']= false;

        let yourImage = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImage = document.querySelector('#dealer-box').querySelectorAll('img');

        for(let i=0;i<yourImage.length;i++){
            yourImage[i].remove();
        }
    
        for(let i=0;i<dealerImage.length;i++){
            dealerImage[i].remove();
        }
    
        YOU['score']=0;
        DEALER['score']=0;
    
        document.querySelector('#your-result').textContent=0;
        document.querySelector('#dealer-result').textContent=0;
    
        document.querySelector('#your-result').style.color = '#ffffff';
        document.querySelector('#dealer-result').style.color = '#ffffff';
    
        document.querySelector('#blackjack-result').textContent= "Let's Play" ;
        document.querySelector('#blackjack-result').style.color= "black" ;

        blackjackGame['turnsOver'] = false;
    }



}



// returns who won
// update the wins, draws and losses

function decideWinner(){
    let winner;

    if(YOU['score']<=21){
        // Your score is higher than dealer or dealer busts

        if(YOU['score']> DEALER['score']  || DEALER['score']>21){
            blackjackGame['wins']++;
            winner= YOU;

        }else if(YOU['score'] < DEALER['score']){
            blackjackGame['losses']++;
            winner=DEALER;

        }else if(YOU['score'] == DEALER['score']){

            blackjackGame['draws']++;


        }

        // when you bust but dealer doesn't
    }else if(YOU['score'] > 21 && DEALER['score']<=21){

        blackjackGame['losses']++;
        winner=DEALER

        //You and dealer bust
    }else if(YOU['score']>21 && DEALER['score']>21){

        blackjackGame['draws']++;

    }
    
    console.log(blackjackGame);
    return winner;
}

function showResult(winner){
    let message , messageColor;

    if(blackjackGame['turnsOver'] == true){


        if(winner == YOU){
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message= 'You Won!';
            messageColor = 'green';
            winSound.play();
        }
        else if(winner == DEALER){
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message= 'You Lost!';
            messageColor = 'red';
            lossSound.play();
        }
        else{
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message= 'You Drew!';
            messageColor = 'black';
            
        }
        document.querySelector('#blackjack-result').textContent= message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
    
    
}