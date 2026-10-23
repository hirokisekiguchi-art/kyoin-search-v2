import React, { useEffect } from 'react';
import { ArrowRight, BookOpen, Search, SkipForward } from 'lucide-react';

interface V2IntroProps { onComplete: () => void }

export const V2Intro: React.FC<V2IntroProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 2800);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="v2-intro" role="dialog" aria-label="教員サーチ バージョン2へようこそ">
      <div className="v2-intro-edition">THE OPEN INDEX — VOL. 02</div>
      <div className="v2-book" aria-hidden="true">
        <div className="v2-book-page v2-page-left">
          <BookOpen size={30} />
          <strong>学校と人を、<br />ひもとく。</strong>
          <span>PUBLIC SCHOOL PERSONNEL ARCHIVE</span>
        </div>
        <div className="v2-book-page v2-page-right">
          <b>先生を探す</b>
          <div><Search size={15} /> 気になる名前から</div>
          <p>01　先生の歩み</p><p>02　学校とのつながり</p><p>03　地域からの発見</p>
        </div>
        <div className="v2-book-cover"><BookOpen size={32} /><strong>教員<br />サーチ</strong><small>知りたい、のその先へ。</small></div>
      </div>
      <p>一冊の索引をひらくように、先生の歩みを探す。</p>
      <button onClick={onComplete}>スキップして探す <SkipForward size={16} /><ArrowRight size={16} /></button>
    </div>
  );
};
