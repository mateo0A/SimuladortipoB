(() => {
  const bank = Array.isArray(window.QUESTION_BANK) ? window.QUESTION_BANK : [];
  const TOTAL = 20;
  let quiz = [], answers = {}, current = 0, previousIds = new Set(), finished = false;
  const $ = id => document.getElementById(id);
  const els = {progressText:$('progressText'),answeredText:$('answeredText'),progressBar:$('progressBar'),questionNumber:$('questionNumber'),questionText:$('questionText'),imageWrap:$('questionImageWrap'),image:$('questionImage'),options:$('optionsList'),prev:$('prevBtn'),next:$('nextBtn'),submit:$('submitBtn'),saveHint:$('saveHint'),unanswered:$('unansweredHint'),quizPanel:$('quizPanel'),resultPanel:$('resultPanel'),score:$('scoreValue'),resultTitle:$('resultTitle'),resultMessage:$('resultMessage'),correct:$('correctCount'),wrong:$('wrongCount'),blank:$('blankCount'),retry:$('retryBtn'),review:$('reviewList'),resultIcon:$('resultIcon'),bankCount:$('bankCount')};
  function shuffle(arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function startQuiz(){
    if(bank.length < TOTAL){els.quizPanel.innerHTML='<h2>No hay suficientes preguntas en el banco para iniciar el simulador.</h2>';return;}
    let pool=bank.filter(q=>!previousIds.has(q.id));
    if(pool.length<TOTAL) pool=bank.slice();
    quiz=shuffle(pool).slice(0,TOTAL); previousIds=new Set(quiz.map(q=>q.id)); answers={};current=0;finished=false;
    els.quizPanel.hidden=false;els.resultPanel.hidden=true;els.submit.disabled=false;renderQuestion();updateStatus();window.scrollTo({top:0,behavior:'smooth'});
  }
  function renderQuestion(){
    const q=quiz[current];if(!q)return;
    els.questionNumber.textContent=`PREGUNTA ${current+1}`;els.questionText.textContent=q.question;
    if(q.image){els.image.src=q.image;els.image.alt=`Imagen de apoyo de la pregunta ${q.id}`;els.imageWrap.hidden=false;}else{els.image.removeAttribute('src');els.imageWrap.hidden=true;}
    els.options.innerHTML='';
    q.options.forEach(op=>{
      const label=document.createElement('label');label.className='option';
      const input=document.createElement('input');input.type='radio';input.name='answer';input.value=op.letter;input.checked=answers[q.id]===op.letter;input.addEventListener('change',()=>{answers[q.id]=op.letter;updateStatus();els.saveHint.textContent='Respuesta guardada.';});
      const letter=document.createElement('span');letter.className='option-letter';letter.textContent=op.letter.toUpperCase();
      const text=document.createElement('span');text.className='option-text';text.textContent=op.text;
      label.append(input,letter,text);els.options.appendChild(label);
    });
    els.prev.disabled=current===0;els.next.textContent=current===TOTAL-1?'Ver última pregunta':'Siguiente';
    els.saveHint.textContent=answers[q.id]?'Tu respuesta está guardada.':'Selecciona una opción para continuar.';
    updateStatus();
  }
  function updateStatus(){const answered=Object.keys(answers).length;els.progressText.textContent=`${current+1} de ${TOTAL}`;els.answeredText.textContent=`${answered} de ${TOTAL}`;els.progressBar.style.width=`${((current+1)/TOTAL)*100}%`;els.unanswered.textContent=answered===TOTAL?'Has respondido las 20 preguntas.':'Puedes revisar tus respuestas antes de terminar.';}
  function finishQuiz(){
    const blanks=quiz.filter(q=>!answers[q.id]).length;
    if(blanks>0&&!confirm(`Te faltan ${blanks} pregunta(s) por responder. ¿Quieres terminar de todos modos?`))return;
    finished=true;let correct=0;
    quiz.forEach(q=>{const op=q.options.find(o=>o.letter===answers[q.id]);if(op&&op.correct)correct++;});
    const wrong=TOTAL-blanks-correct;els.score.textContent=correct;els.correct.textContent=correct;els.wrong.textContent=wrong;els.blank.textContent=blanks;
    els.resultTitle.textContent=correct===20?'¡Puntaje perfecto!':'Tu calificación';
    els.resultMessage.textContent=correct===20?'¡Excelente! Respondiste correctamente las 20 preguntas.':`Obtuviste ${correct} de 20 puntos. Revisa las respuestas y vuelve a intentarlo cuando quieras.`;
    els.resultIcon.textContent=correct>=14?'✓':'↻';els.quizPanel.hidden=true;els.resultPanel.hidden=false;els.review.innerHTML='<h3>Revisión de respuestas</h3>';
    quiz.forEach((q,i)=>{const selected=q.options.find(o=>o.letter===answers[q.id]);const right=q.options.find(o=>o.correct);const item=document.createElement('div');item.className='review-item';const title=document.createElement('strong');title.textContent=`${i+1}. ${q.question}`;const yours=document.createElement('p');yours.className=selected&&selected.correct?'good':'bad';yours.textContent=`Tu respuesta: ${selected?selected.letter.toUpperCase()+'. '+selected.text:'Sin responder'}`;const answer=document.createElement('p');answer.className='good';answer.textContent=`Respuesta correcta: ${right?right.letter.toUpperCase()+'. '+right.text:'No identificada en el documento'}`;item.append(title,yours,answer);els.review.appendChild(item);});
    window.scrollTo({top:0,behavior:'smooth'});
  }
  els.prev.addEventListener('click',()=>{if(current>0){current--;renderQuestion();}});
  els.next.addEventListener('click',()=>{if(current<TOTAL-1){current++;renderQuestion();}else{els.questionText.scrollIntoView({behavior:'smooth',block:'center'});}});
  els.submit.addEventListener('click',finishQuiz);els.retry.addEventListener('click',startQuiz);
  els.bankCount.textContent=`Banco: ${bank.length} preguntas`;
  startQuiz();
})();
