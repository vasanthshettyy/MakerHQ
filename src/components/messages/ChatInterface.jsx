import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../layout/PageWrapper';
import { 
    Send, MessageSquare, User, 
    Loader2, Search, Circle, ChevronLeft,
    Lock, Info, CheckCircle2, Clock, Zap,
    Building2, Users, ShieldCheck, Sparkles,
    ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREMIUM_SPRING, STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION } from '../../lib/motion';
import { formatRelativeTime, cn } from '../../lib/utils';

export default function ChatInterface() {
    const { user, role } = useAuth();
    const [threads, setThreads] = useState([]);
    const [selectedThread, setSelectedThread] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);

    async function fetchThreads() {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('contracts')
                .select(`
                    id,
                    status,
                    brand_id,
                    influencer_id,
                    gigs(title),
                    profiles_brand(company_name, logo_url),
                    profiles_influencer(full_name, avatar_url)
                `)
                .or(`brand_id.eq.${user.id},influencer_id.eq.${user.id}`)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setThreads(data || []);
        } catch (err) {
            console.error('Error fetching chat threads:', err);
        } finally {
            setLoading(false);
        }
    }

    async function fetchMessages(contractId) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('contract_id', contractId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    }

    useEffect(() => {
        fetchThreads();
    }, [user]);

    useEffect(() => {
        if (selectedThread) {
            fetchMessages(selectedThread.id);

            const channel = supabase
                .channel(`chat-${selectedThread.id}`)
                .on('postgres_changes', { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'messages',
                    filter: `contract_id=eq.${selectedThread.id}`
                }, (payload) => {
                    setMessages(prev => {
                        if (prev.some(m => m.id === payload.new.id)) return prev;
                        return [...prev, payload.new];
                    });
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [selectedThread]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    async function handleSendMessage(e) {
        e.preventDefault();
        const isMessagingAllowed = selectedThread?.status === 'Active' || selectedThread?.status === 'Completed';
        
        if (!newMessage.trim() || !selectedThread || sending || !isMessagingAllowed) return;

        setSending(true);
        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    contract_id: selectedThread.id,
                    sender_id: user.id,
                    content: newMessage.trim()
                });

            if (error) throw error;
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setSending(false);
        }
    }

    const getPartnerInfo = (thread) => {
        if (role === 'brand') {
            return {
                name: thread.profiles_influencer?.full_name,
                avatar: thread.profiles_influencer?.avatar_url,
                roleLabel: 'Creator Node'
            };
        }
        return {
            name: thread.profiles_brand?.company_name,
            avatar: thread.profiles_brand?.logo_url,
            roleLabel: 'Brand Entity'
        };
    };

    return (
        <PageWrapper title="Network Comms" subtitle="Encrypted signal relay for secure campaign synchronization.">
            <div className="flex h-[calc(100vh-240px)] glass-card !rounded-[2.5rem] border-white/5 bg-surface-900/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />

                {/* Threads Matrix */}
                <div className={cn(
                    "w-full md:w-85 border-r border-white/5 flex flex-col transition-all bg-black/20 backdrop-blur-sm z-10",
                    selectedThread && "hidden md:flex"
                )}>
                    <div className="p-6 border-b border-white/5">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search active signals..."
                                className="w-full pl-11 pr-4 py-3 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-12 gap-4 opacity-40">
                                <Loader2 className="animate-spin text-primary w-6 h-6" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim">Scanning Nodes</p>
                            </div>
                        ) : threads.length === 0 ? (
                            <div className="text-center p-12 flex flex-col items-center gap-6">
                                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-text-dim border border-white/5 opacity-40">
                                    <MessageSquare size={32} strokeWidth={1} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted leading-relaxed">No secure channels established</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {threads.map(thread => {
                                    const partner = getPartnerInfo(thread);
                                    const isActive = selectedThread?.id === thread.id;
                                    return (
                                        <motion.button
                                            key={thread.id}
                                            layout
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.02)' }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedThread(thread)}
                                            className={cn(
                                                "w-full p-4 rounded-[1.75rem] flex items-center gap-4 transition-all text-left group border relative overflow-hidden",
                                                isActive 
                                                    ? "bg-primary/10 border-primary/20 shadow-lg shadow-primary/10" 
                                                    : "bg-transparent border-transparent"
                                            )}
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-surface-900 border border-white/10 p-0.5 shadow-xl flex-shrink-0 relative">
                                                {partner.avatar ? (
                                                    <img src={partner.avatar} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-primary font-black text-sm uppercase bg-primary/10">
                                                        {partner.name?.charAt(0)}
                                                    </div>
                                                )}
                                                {thread.status === 'Active' && (
                                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-success border-2 border-surface-950 rounded-full shadow-lg" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between mb-0.5 gap-2">
                                                    <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{partner.name}</p>
                                                </div>
                                                <p className="text-[10px] text-text-dim font-medium truncate uppercase tracking-widest">{thread.gigs?.title}</p>
                                            </div>
                                            {isActive && (
                                                <motion.div 
                                                    layoutId="active-chat-indicator"
                                                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                                                />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* Relay Window */}
                <div className={cn(
                    "flex-1 flex flex-col bg-transparent relative z-0",
                    !selectedThread && "hidden md:flex items-center justify-center bg-white/[0.01]"
                )}>
                    {selectedThread ? (
                        <>
                            {/* Relay Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surface-950/40 backdrop-blur-xl">
                                <div className="flex items-center gap-5">
                                    <motion.button 
                                        {...MICRO_INTERACTION}
                                        onClick={() => setSelectedThread(null)} 
                                        className="md:hidden p-2.5 bg-white/5 rounded-xl text-text-muted hover:text-white transition-all"
                                    >
                                        <ChevronLeft size={20} />
                                    </motion.button>
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-surface-900 border border-white/10 p-0.5 shadow-2xl relative">
                                            {getPartnerInfo(selectedThread).avatar ? (
                                                <img src={getPartnerInfo(selectedThread).avatar} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-primary font-black text-lg uppercase bg-primary/10">
                                                    {getPartnerInfo(selectedThread).name?.charAt(0)}
                                                </div>
                                            )}
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-surface-950 rounded-full shadow-lg shadow-success/20" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-display font-black text-white tracking-tight leading-none mb-1.5 flex items-center gap-2">
                                                {getPartnerInfo(selectedThread).name}
                                                <ShieldCheck size={14} className="text-primary opacity-60" />
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest",
                                                    selectedThread.status === 'Active' ? "bg-success/10 text-success border-success/20" : "bg-white/5 border-white/10 text-text-dim"
                                                )}>
                                                    {selectedThread.status}
                                                </div>
                                                <span className="text-[10px] text-text-dim font-bold uppercase tracking-tighter truncate max-w-[200px]">
                                                    Signal: {selectedThread.gigs?.title}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden lg:flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em] mb-0.5">Relay Status</p>
                                        <p className="text-[10px] font-bold text-success uppercase tracking-widest">Encrypted</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-text-muted">
                                        <Lock size={18} strokeWidth={1.5} />
                                    </div>
                                </div>
                            </div>

                            {/* Signal Stream */}
                            <div 
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 custom-scrollbar"
                            >
                                <AnimatePresence mode="popLayout">
                                    {messages.map((msg, idx) => {
                                        const isOwn = msg.sender_id === user.id;
                                        return (
                                            <motion.div
                                                key={msg.id || idx}
                                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                className={cn(
                                                    "flex w-full",
                                                    isOwn ? "justify-end" : "justify-start"
                                                )}
                                            >
                                                <div className={cn(
                                                    "max-w-[80%] md:max-w-[55%] flex flex-col",
                                                    isOwn ? "items-end" : "items-start"
                                                )}>
                                                    <div className={cn(
                                                        "p-5 rounded-[2rem] text-sm leading-relaxed font-medium shadow-2xl",
                                                        isOwn 
                                                            ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                                                            : "glass-card rounded-tl-none border-white/10 text-white bg-surface-900/60"
                                                    )}>
                                                        {msg.content}
                                                    </div>
                                                    <span className="text-[8px] mt-3 font-black uppercase tracking-[0.25em] text-text-dim px-2">
                                                        Transmission Log • {formatRelativeTime(msg.created_at)}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                                <div className="h-4" />
                            </div>

                            {/* Command Input Area */}
                            <div className="p-8 bg-surface-950/60 backdrop-blur-2xl border-t border-white/5">
                                {selectedThread.status === 'Active' || selectedThread.status === 'Completed' ? (
                                    <form onSubmit={handleSendMessage} className="flex gap-5 items-center max-w-5xl mx-auto">
                                        <div className="flex-1 relative group">
                                            <input 
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Transmit secure signal..."
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-3xl px-8 py-5 text-sm text-white placeholder:text-text-dim outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all shadow-inner"
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3 opacity-30 group-focus-within:opacity-100 transition-opacity">
                                                <Sparkles size={16} className="text-primary animate-pulse" />
                                            </div>
                                        </div>
                                        <motion.button 
                                            type="submit"
                                            disabled={!newMessage.trim() || sending}
                                            {...MICRO_INTERACTION}
                                            className="w-16 h-16 rounded-[1.75rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-2xl shadow-primary/20 transition-all disabled:opacity-20 disabled:grayscale cursor-pointer"
                                        >
                                            {sending ? <Loader2 className="animate-spin w-6 h-6" /> : <Send size={24} className="ml-1" />}
                                        </motion.button>
                                    </form>
                                ) : (
                                    <div className="flex items-center justify-center gap-4 p-6 rounded-[2rem] bg-rose-500/5 border border-dashed border-rose-500/20 text-rose-400">
                                        <Lock size={20} strokeWidth={1.5} />
                                        <p className="text-[10px] font-black uppercase tracking-[0.25em]">Channel Locked: Protocol Status {selectedThread.status}</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-12 select-none animate-fade-in flex flex-col items-center">
                            <div className="relative mb-10">
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" 
                                />
                                <div className="w-28 h-24 rounded-[2.5rem] bg-surface-900 border border-white/5 flex items-center justify-center relative z-10 shadow-2xl">
                                    <MessageSquare size={56} strokeWidth={1} className="text-primary/40" />
                                </div>
                                <motion.div 
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity }}
                                    className="absolute -top-3 -right-3 p-3 rounded-2xl bg-primary/20 border border-primary/30 text-primary shadow-glow"
                                >
                                    <Zap size={20} fill="currentColor" />
                                </motion.div>
                            </div>
                            
                            <h3 className="text-3xl font-display font-black text-white mb-4 tracking-tighter uppercase">Campaign Messenger</h3>
                            <p className="text-sm text-text-muted max-w-sm leading-relaxed font-medium mb-12">
                                Initialize a secure transmission relay to coordinate campaign logic, assets, and strategic feedback.
                            </p>

                            <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
                                <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 text-left group hover:bg-white/[0.04] transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success mb-5 shadow-lg shadow-success/5">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Encrypted Tunnel</p>
                                    <p className="text-[10px] text-text-dim font-bold leading-relaxed">Multi-layer security for sensitive campaign node data.</p>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 text-left group hover:bg-white/[0.04] transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 shadow-lg shadow-primary/5">
                                        <Zap size={20} />
                                    </div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Real-time Sync</p>
                                    <p className="text-[10px] text-text-dim font-bold leading-relaxed">Instant signal propagation with zero-latency response.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
