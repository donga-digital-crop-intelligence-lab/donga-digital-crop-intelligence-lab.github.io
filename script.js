/* 메뉴와 논문 필터·검색을 처리합니다. */
let pageController;
function initPage(){
  pageController?.abort();pageController=new AbortController();
  const options={signal:pageController.signal};
  const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-nav');
  if(toggle&&nav){
    toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);toggle.textContent=open?'닫기':'메뉴';},options);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){toggle.setAttribute('aria-expanded','false');nav.classList.remove('open');toggle.textContent='메뉴';toggle.focus();}},options);
  }
  const lightbox=document.getElementById('keyword-lightbox');
  if(lightbox){
    const image=lightbox.querySelector('#keyword-lightbox-image'),title=lightbox.querySelector('#keyword-lightbox-title'),caption=lightbox.querySelector('#keyword-lightbox-caption');
    let opener=null;
    document.querySelectorAll('.keyword-visual').forEach(button=>button.addEventListener('click',()=>{
      const source=button.querySelector('img');opener=button;image.src=source.currentSrc||source.src;image.alt=source.alt;
      title.textContent=button.dataset.title;caption.textContent=button.closest('figure').querySelector('figcaption').textContent;
      lightbox.showModal();document.documentElement.style.overflow='hidden';
    },options));
    lightbox.querySelector('.keyword-lightbox-close').addEventListener('click',()=>lightbox.close(),options);
    lightbox.addEventListener('click',event=>{if(event.target===lightbox){const r=lightbox.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)lightbox.close();}},options);
    lightbox.addEventListener('close',()=>{document.documentElement.style.overflow='';opener?.focus({preventScroll:true});},options);
  }
  const papers=[...document.querySelectorAll('.publication[data-category]')];if(!papers.length)return;
  const groups=[...document.querySelectorAll('.publication-year')],search=document.getElementById('paper-search'),buttons=[...document.querySelectorAll('.filter')],count=document.getElementById('paper-count'),empty=document.getElementById('no-results');
  let category='all';
  const refresh=()=>{
    const term=(search.value||'').trim().toLocaleLowerCase();let total=0;
    papers.forEach(p=>{const show=(category==='all'||p.dataset.category===category)&&p.textContent.toLocaleLowerCase().includes(term);p.hidden=!show;if(show)total++;});
    groups.forEach(group=>{const n=[...group.querySelectorAll('.publication')].filter(p=>!p.hidden).length;group.hidden=n===0;group.querySelector('.year-count').textContent=n+'편';});
    const label=term?'검색 결과':category==='all'?'전체 논문':category.toUpperCase()+' 논문';count.textContent=label+' '+total+'편';empty.hidden=total!==0;
  };
  const select=key=>{category=key;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===key)));refresh();};
  buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.filter),options));search.addEventListener('input',refresh,options);
  document.getElementById('reset-papers').addEventListener('click',()=>{search.value='';select('all');},options);refresh();
}
document.addEventListener('DOMContentLoaded',initPage,{once:true});
