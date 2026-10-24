import React, { useState } from 'react';
import { User, ForumPost } from '../types';
import {
  getStoredForumPosts,
  saveForumPosts,
} from '../utils/storage';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  ThumbsUp,
  BookOpen,
  Plus,
  Sparkles,
  Search,
} from 'lucide-react';

interface ForumViewProps {
  user: User;
}

export const ForumView: React.FC<ForumViewProps> = ({ user }) => {
  const [posts, setPosts] = useState<ForumPost[]>(getStoredForumPosts());
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Produktif Kejuruan');
  const [newContent, setNewContent] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: `post_${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      subject: newSubject,
      title: newTitle.trim(),
      content: newContent.trim(),
      createdAt: 'Baru saja',
      likes: 0,
      answers: [],
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    saveForumPosts(updated);

    setNewTitle('');
    setNewContent('');
    setShowNewPostModal(false);
  };

  const handleAddAnswer = (postId: string) => {
    const text = replyText[postId];
    if (!text || !text.trim()) return;

    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          answers: [
            ...p.answers,
            {
              id: `ans_${Date.now()}`,
              authorId: user.id,
              authorName: user.name,
              authorRole: user.role,
              content: text.trim(),
              createdAt: 'Baru saja',
              isTeacherVerified: user.role === 'guru',
            },
          ],
        };
      }
      return p;
    });

    setPosts(updated);
    saveForumPosts(updated);
    setReplyText((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleLike = (postId: string) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    });
    setPosts(updated);
    saveForumPosts(updated);
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Forum Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Diskusi Vokasi & Modul Pembelajaran</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Forum Tanya Jawab Vokasi
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
            Ajukan kendala teknis praktikum kejuruan, diskusikan 10 materi mapel, dan dapatkan jawaban terverifikasi langsung dari Bapak/Ibu Guru.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewPostModal(true)}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-cyan-600/20 shrink-0 self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Pertanyaan Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari topik diskusi atau mapel kejuruan..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {post.authorName}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold uppercase">
                  {post.authorRole}
                </span>
                <span className="text-[11px] text-slate-400">&bull; {post.createdAt}</span>
              </div>

              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                {post.subject}
              </span>
            </div>

            {/* Post Content */}
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">
                {post.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleLike(post.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-cyan-700 hover:bg-slate-50 transition"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{post.likes} Bermanfaat</span>
              </button>
              <span className="text-xs text-slate-400 font-medium">
                {post.answers.length} Jawaban
              </span>
            </div>

            {/* Answers List */}
            {post.answers.length > 0 && (
              <div className="space-y-2.5 pt-2">
                {post.answers.map((ans) => (
                  <div
                    key={ans.id}
                    className={`p-3.5 rounded-2xl text-xs space-y-1.5 ${
                      ans.isTeacherVerified
                        ? 'bg-blue-50/70 border border-blue-200 text-blue-950'
                        : 'bg-slate-50 border border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">
                          {ans.authorName}
                        </span>
                        {ans.isTeacherVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Jawaban Guru Terverifikasi</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{ans.createdAt}</span>
                    </div>
                    <p className="leading-relaxed">{ans.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Answer Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={replyText[post.id] || ''}
                onChange={(e) =>
                  setReplyText((prev) => ({ ...prev, [post.id]: e.target.value }))
                }
                placeholder="Tuliskan jawaban atau tanggapan Anda..."
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => handleAddAnswer(post.id)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Balas</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
        >
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Buat Topik Diskusi Baru
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Bagikan pertanyaan praktikum atau diskusikan konsep mapel kejuruan.
            </p>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mata Pelajaran:
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
                >
                  <option value="Produktif Kejuruan">Produktif Kejuruan</option>
                  <option value="Informatika">Informatika</option>
                  <option value="Matematika">Matematika</option>
                  <option value="English">English</option>
                  <option value="Kewirausahaan">Kewirausahaan</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="PPKn">PPKn</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Pertanyaan:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Mengapa sensor proximity induktif tidak mendeteksi bahan tembaga?"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Uraian Detail:
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Jelaskan kondisi praktikum dan apa yang sudah dicoba..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition"
                >
                  Publikasikan Diskusi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
