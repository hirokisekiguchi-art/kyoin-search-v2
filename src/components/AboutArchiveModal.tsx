import React, { useState } from 'react';
import { X, ShieldCheck, HeartHandshake, FileCheck, CheckCircle2, MessageSquare, Send } from 'lucide-react';

interface AboutArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutArchiveModal: React.FC<AboutArchiveModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'privacy' | 'contact'>('about');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    targetNameOrSchool: '',
    category: '同姓同名・人物分離の照会',
    details: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200"
        role="dialog"
        aria-labelledby="about-modal-title"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="about-modal-title" className="text-xl font-bold text-slate-900">
                「教員サーチ」について
              </h2>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                南関東先行公開
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              公立学校人事アーカイブの設立思想・安全な口コミ運用・プライバシー基準
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 py-2 border-b border-slate-100 flex items-center gap-2 text-xs bg-white">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'about'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            サービス概要と設立思想
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'privacy'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            情報の信頼性と安全な口コミ運用
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'contact'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            訂正・照会お申し出窓口
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                <div className="font-bold text-sm text-blue-950 mb-1">
                  メインコピー：「あの先生、今どこにいるんだろう？」
                </div>
                進学、卒業、引越し、あるいは何気ない日常の会話の中で、ふと昔お世話になった恩師の先生を思い出すことがあります。
                公立学校の教職員人事異動は毎年各都道府県・市区町村の公報や教育委員会告示によって公に告知されていますが、PDFの分冊や膨大な名簿に分散し、一般の市民が過去をさかのぼって探すのは困難でした。
                「教員サーチ」は、こうした公立教育機関の公式人事記録を安全に体系化し、先生・学校・地域の歩みをたどれる公共アーカイブです。
                現在、スモールスタートとして南関東（東京都・神奈川県・埼玉県・千葉県）を中心に先行公開しています。
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-1.5 text-sm">
                  回遊できるアーカイブ構造
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  先生の名前から最新の学校を調べ、その学校に過去どんな先生が在籍していたかをたどり、さらにそこから別の先生の歩みをたどる。
                  教育の歴史と公的な足跡を、安全かつ直感的に探索できます。
                </p>
              </div>

              <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                  <span>安全な口コミ運用：Googleマップ連携の採用</span>
                </div>
                <div className="leading-relaxed text-emerald-900/90">
                  当サイトでは誹謗中傷や管理リスクを未然に防ぐため、自社サイト内での独自口コミ投稿・レビュー機能はあえて設けず、Googleマップの公開レビュー機能へ安全に誘導する運用方針を採用しています。公的人事アーカイブとしての信頼性を損なうことなく、学校周辺の生きた評判や地図情報を確認できます。
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    公的資料のみを典拠とする原則
                  </h4>
                  <p className="leading-relaxed">
                    本アーカイブのすべてのデータは、都道府県教育委員会・政令指定都市・市区町村が公表した「教職員定期人事異動公報」「告示」および学校要覧を情報源としています。個人のブログ、SNS、匿名の書き込みなどを根拠とした人物登録は行いません。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <FileCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    同姓同名の別人分離ルール
                  </h4>
                  <p className="leading-relaxed">
                    同じ氏名であっても、自治体・校種・教科・勤続年数が整合しない限り、自動的に同一人物として統合（名寄せ）しません。同姓同名候補が存在する場合は、明確に別候補として分離して表示します。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <HeartHandshake className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    私的プライバシーの不掲載
                  </h4>
                  <p className="leading-relaxed">
                    私的な自宅住所、電話番号、個人メール、家族情報、日常の私生活情報などは一切扱いません。公務員として公表された職務上の所属・役職情報のみを管理します。
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div>
              {formSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900">
                    照会・訂正のお申し出を受け付けました
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    公報の原文記録と照合の上、審査・データ修正または同姓同名の分離処理を迅速に行います。
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        targetNameOrSchool: '',
                        category: '同姓同名・人物分離の照会',
                        details: '',
                      });
                    }}
                    className="mt-2 text-xs text-blue-600 font-semibold underline"
                  >
                    別の照会を送信する
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <p className="text-slate-600 text-xs mb-3">
                    公報の異体字誤記、学校統合履歴の追加、または同姓同名の誤統合に関する分離申し出はこちらから受け付けています。
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        お名前（または関係機関名）
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="例: 佐藤"
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        ご連絡先メールアドレス
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@edu.jp"
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        対象の先生名・学校名
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.targetNameOrSchool}
                        onChange={(e) => setFormData({ ...formData, targetNameOrSchool: e.target.value })}
                        placeholder="例: 桜丘中学校 / 鈴木雅彦"
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        申し立て種別
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      >
                        <option value="同姓同名・人物分離の照会">同姓同名・人物分離の照会</option>
                        <option value="公報記載との異体字・誤記訂正">公報記載との異体字・誤記訂正</option>
                        <option value="学校沿革・改称情報の提供">学校沿革・改称情報の提供</option>
                        <option value="非表示・削除のご相談">非表示・削除のご相談</option>
                        <option value="その他">その他</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      詳しい内容・典拠公報情報
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="例: 令和8年度公報登載の○○先生について、別の高校所属の教員と別人物ですので分離をお願いします。"
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-2 text-right">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 ml-auto transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>照会を送信する</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
