import Image from 'next/image';
import { Author } from '@/lib/authors';

interface BlogAuthorProps {
    author: Author;
}

export function BlogAuthor({ author }: BlogAuthorProps) {
    return (
        <div className="flex justify-end mt-12 mb-8">
            <div className="flex items-center gap-4 bg-zinc-50/80 hover:bg-zinc-100 transition-colors p-3 pr-5 rounded-2xl border border-zinc-100 max-w-[400px]">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-sm ring-2 ring-white">
                    <Image
                        src={author.image}
                        alt={author.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-sm font-bold text-zinc-900">{author.name}</h3>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                            Editör
                        </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2 italic">
                        &quot;{author.bio}&quot;
                    </p>
                </div>
            </div>
        </div>
    );
}
