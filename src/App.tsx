import { useCallback, useEffect, useRef, useState } from 'react';
import PagodaThreeScene, { type DetailView } from './PagodaThreeScene';

const DURATION=24;
const stages=[['石台与阶道',.23],['朱柱与旋转木梯',.43],['斗拱与下层飞檐',.61],['上层楼板与观景廊',.75],['上层屋瓦与花格',.9],['铜饰与悬灯',.995],['落成 · 双层重檐亭',1]] as const;

export default function App(){
  const [progress,setProgress]=useState(1),[playing,setPlaying]=useState(false);
  const [ready,setReady]=useState(false),[view,setView]=useState<DetailView>('overview');
  const started=useRef(0);
  const onReady=useCallback(()=>{started.current=performance.now();setReady(true);},[]);
  useEffect(()=>{
    if(!ready || !playing)return;
    let frame=0;
    const tick=(now:number)=>{
      const next=Math.min(1,(now-started.current)/(DURATION*1000));setProgress(next);
      if(next===1)setPlaying(false);else frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[ready,playing]);
  const seek=useCallback((p:number)=>{const next=Math.max(0,Math.min(1,p));started.current=performance.now()-next*DURATION*1000;setProgress(next);},[]);
  const replay=()=>{setView('overview');seek(0);setPlaying(true);};
  const toggle=()=>{seek(progress===1?0:progress);setPlaying(progress===1 || !playing);};
  const detail=(v:DetailView)=>{setView(v);if(v!=='overview'){seek(1);setPlaying(false);}};
  const stage=stages.find(([,end])=>progress<end)?.[0]??'落成';
  return <main className="poster">
    <header><span className="wordmark"><i>亭</i>听风亭<em>THE WIND PAVILION</em></span><small>朱柱 · 青瓦 · 双层重檐</small><div className="header-actions"><button disabled={!ready} onClick={replay}>观看营造 ↺</button></div></header>
    <section className="scene">
      <aside className="brief"><p className="micro">ARCHITECTURAL STUDY / 01</p><h2>重檐听风。</h2><p className="accent">双层登临 · 螺旋木梯 · 斗拱承檐</p><blockquote>朱漆映青瓦，铜铃悬飞角。<br/>循木梯而上，四面皆可观景。</blockquote></aside>
      <div className="tower-stage">
        <PagodaThreeScene progress={progress} view={view} onReady={onReady}/>
        {!ready&&<div className="scene-loading">展卷 · 营造中</div>}
        <div className="stage-label"><i/>{stage}<span>{Math.round(progress*100)}%</span></div>
        <div className="view-selector" role="group" aria-label="观赏视角">{([['overview','整亭全景'],['roof','重檐细赏'],['guardian','木梯与花格']] as const).map(([id,label])=><button key={id} disabled={!ready} aria-pressed={view===id} onClick={()=>detail(id)}>{label}</button>)}</div>
        <div className="orbit-hint">左键旋转 · 滚轮缩放 · 右键平移</div>
      </div>
    </section>
    <footer><button className="play" disabled={!ready} onClick={toggle} aria-label={playing?'暂停':'播放'}>{playing?'Ⅱ':'▶'}</button><div className="timeline"><span style={{width:`${progress*100}%`}}/><input aria-label="施工进度" disabled={!ready} type="range" min="0" max="1000" value={Math.round(progress*1000)} onChange={e=>seek(Number(e.target.value)/1000)}/></div><time>{(progress*DURATION).toFixed(1)} / {DURATION} S</time></footer>
  </main>;
}
