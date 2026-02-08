'use client';

import { useState, useEffect } from 'react';
import { Offer, IncludedItem } from '@/lib/types';
import { createOffer, updateOffer, deleteOffer } from './actions';
import { getDefaultIncludedItems } from '@/lib/defaults';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus, ExternalLink, GripVertical, Check, X } from 'lucide-react';
import Link from 'next/link';

// Imports for DnD
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
function SortableItem({ item, index, toggleActive, updateText, removeItem }: {
    item: IncludedItem,
    index: number,
    toggleActive: (index: number) => void,
    updateText: (index: number, field: 'title' | 'description', value: string) => void,
    removeItem: (index: number) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className={`flex gap-3 items-start p-3 rounded border ${item.isActive ? 'bg-white border-blue-200' : 'bg-gray-100 border-gray-200 opacity-75'}`}>
            <div className="pt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600" {...attributes} {...listeners}>
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="pt-2">
                <input
                    type="checkbox"
                    checked={item.isActive}
                    onChange={() => toggleActive(index)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
            </div>

            <div className="flex-1 space-y-2">
                <Input
                    value={item.title}
                    onChange={(e) => updateText(index, 'title', e.target.value)}
                    placeholder="Başlık"
                    className="font-medium h-8"
                />
                <Input
                    value={item.description}
                    onChange={(e) => updateText(index, 'description', e.target.value)}
                    placeholder="Açıklama"
                    className="text-xs h-7"
                />
            </div>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                className="h-8 w-8 text-red-400 hover:text-red-700 hover:bg-red-50"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    );
}

// Included Item Editor Component
function IncludedItemsEditor({
    items,
    onChange,
    region
}: {
    items: IncludedItem[],
    onChange: (items: IncludedItem[]) => void,
    region: string
}) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            onChange(arrayMove(items, oldIndex, newIndex));
        }
    };

    const toggleActive = (index: number) => {
        const newItems = [...items];
        newItems[index].isActive = !newItems[index].isActive;
        onChange(newItems);
    };

    const updateText = (index: number, field: 'title' | 'description', value: string) => {
        const newItems = [...items];
        newItems[index][field] = value;
        onChange(newItems);
    };

    const addItem = () => {
        const newItem: IncludedItem = {
            id: crypto.randomUUID(),
            title: "",
            description: "",
            isActive: true,
            isCustom: true
        };
        onChange([...items, newItem]);
    };

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        onChange(newItems);
    };

    // Auto-update defaults if region changes and item is NOT custom and NOT modified?
    // User wants "Localhost check" -> We will stick to manual manual is safer.
    // But we need to populate defaults initially.

    return (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 border rounded-md p-2 bg-gray-50">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">Neler Dahil? (Sürükle bırak ile sıralayabilirsiniz)</h3>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <SortableItem
                                key={item.id}
                                item={item}
                                index={index}
                                toggleActive={toggleActive}
                                updateText={updateText}
                                removeItem={removeItem}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-full dashed border-gray-400 text-gray-600 mt-2">
                <Plus className="w-4 h-4 mr-2" /> Yeni Madde Ekle
            </Button>
        </div>
    );
}


export default function OfferManager({ offers }: { offers: Offer[] }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isWarming, setIsWarming] = useState(false);

    // Form States
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
    const [tempRegion, setTempRegion] = useState("");
    const [currentItems, setCurrentItems] = useState<IncludedItem[]>([]);

    // Init Defaults on Add Open
    useEffect(() => {
        if (isAddOpen && currentItems.length === 0) {
            // Wait for user to type region or just giving empty?
            // Better: When "Add" is clicked, init with empty region defaults if region empty, or just empty list?
            // Let's Init with generic defaults or empty
            setCurrentItems(getDefaultIncludedItems("Bölge"));
        }
    }, [isAddOpen]);

    // Handle Edit Click
    const handleEditClick = (offer: Offer) => {
        setEditingOffer(offer);
        setTempRegion(offer.region);

        // If items exist, use them. If null/undefined (legacy), generate defaults based on saved region.
        if (offer.included_items && offer.included_items.length > 0) {
            setCurrentItems(offer.included_items);
        } else {
            setCurrentItems(getDefaultIncludedItems(offer.region));
        }

        setIsEditOpen(true);
    };

    const handleDeleteClick = async (id: string) => {
        if (confirm('Bu teklifi silmek istediğinize emin misiniz?')) {
            await deleteOffer(id);
        }
    };

    // When region changes in Add mode, maybe we want to refresh defaults?
    // BUT user said "I want to manually add". AUTOMAGIC might be annoying.
    // Use a "Şablondan Doldur" button? Or just let them edit.
    // I will stick to: Initial Load -> Populate. Then User Edits. No Auto-overwrite.

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Teklif Yönetimi</h2>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                            setTempRegion("Kapadokya"); // Default
                            setCurrentItems(getDefaultIncludedItems("Kapadokya"));
                        }}>
                            <Plus className="w-4 h-4 mr-2" /> Yeni Teklif Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Yeni Teklif Oluştur</DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setIsWarming(true); // Start Loop
                                const formData = new FormData(e.currentTarget);
                                const slug = formData.get('slug') as string;

                                // Inject JSON
                                formData.append('included_items', JSON.stringify(currentItems));

                                try {
                                    // 1. Create on Server (waits for db + server-side warmup)
                                    const result = await createOffer(formData);

                                    if (!result?.success) {
                                        setIsWarming(false);
                                        // Handle specific "duplicate key" error if visible, but actions.ts handles it nicely now
                                        alert(`Hata: ${result?.error || 'Oluşturma başarısız oldu'}`);
                                        return;
                                    }

                                    // 2. Client-Side Verification Gate
                                    const checkUrl = `https://www.yeriniayir.com/tr/${slug}`;
                                    const maxRetries = 20;
                                    let attempts = 0;
                                    let success = false;

                                    while (attempts < maxRetries && !success) {
                                        try {
                                            // Cache bust query to bypass local browser cache if any
                                            const res = await fetch(`${checkUrl}?t=${Date.now()}`, { method: 'GET' });
                                            if (res.ok) {
                                                success = true;
                                                break;
                                            }
                                        } catch (e) {
                                            console.log("Warmup check failed, retrying...", e);
                                        }
                                        await new Promise(r => setTimeout(r, 1000)); // Wait 1s
                                        attempts++;
                                    }

                                    setIsWarming(false);
                                    setIsAddOpen(false);
                                    window.location.reload(); // Refresh list
                                } catch (err) {
                                    setIsWarming(false);
                                    console.error(err);
                                    alert("Beklenmeyen bir hata oluştu.");
                                }
                            }}
                            className="space-y-4 py-4"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="hotel_name">Otel Adı</Label>
                                <Input id="hotel_name" name="hotel_name" placeholder="Örn: Luvicave Hotel" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug">URL Slug</Label>
                                <Input id="slug" name="slug" placeholder="Örn: luvicavehotel-teklif" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Fiyat</Label>
                                <div className="flex gap-2">
                                    <Input id="price" name="price" placeholder="Örn: 29.000" className="flex-1" required />
                                    <Select name="currency" defaultValue="TL">
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="Para Birimi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TL">TL (₺)</SelectItem>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                            <SelectItem value="GBP">GBP (£)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="promo_text">Aylık Fiyat (Metin)</Label>
                                <Input id="promo_text" name="promo_text" placeholder="Örn: Aylık ~2.071 TL" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="region">Bölge</Label>
                                <Input
                                    id="region"
                                    name="region"
                                    placeholder="Örn: Kapadokya"
                                    required
                                    onChange={(e) => setTempRegion(e.target.value)}
                                // defaultValue="Kapadokya"
                                />
                            </div>

                            {/* INCLUDED ITEMS */}
                            <IncludedItemsEditor
                                items={currentItems}
                                onChange={setCurrentItems}
                                region={tempRegion}
                            />

                            {isWarming && (
                                <div className="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center p-4 text-center">
                                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900">Teklif Oluşturuluyor & Hızlandırılıyor...</h3>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Sayfanın dünya genelinde (CDN) önbelleğe alınması için erişim testi yapılıyor.
                                        <br />Lütfen bekleyiniz...
                                    </p>
                                </div>
                            )}

                            <DialogFooter>
                                <Button type="submit" disabled={isWarming}>
                                    {isWarming ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin mr-2" />
                                            Oluşturuluyor...
                                        </>
                                    ) : 'Oluştur'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md bg-white">
                <table className="w-full text-sm text-left">
                    <thead className="text-gray-500 border-b bg-gray-50">
                        <tr>
                            <th className="h-12 px-4 font-medium">Otel Adı</th>
                            <th className="h-12 px-4 font-medium">Bölge</th>
                            <th className="h-12 px-4 font-medium">Fiyat</th>
                            <th className="h-12 px-4 font-medium">Slug (URL)</th>
                            <th className="h-12 px-4 font-medium">Oluşturulma</th>
                            <th className="h-12 px-4 font-medium text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-4 text-center text-gray-500">
                                    Henüz hiç teklif oluşturulmamış.
                                </td>
                            </tr>
                        ) : (
                            offers.map((offer) => (
                                <tr key={offer.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="p-4 font-medium">{offer.hotel_name}</td>
                                    <td className="p-4">{offer.region}</td>
                                    <td className="p-4">{offer.region}</td>
                                    <td className="p-4">
                                        {offer.price} {offer.currency === 'USD' ? '$' : offer.currency === 'EUR' ? '€' : offer.currency === 'GBP' ? '£' : 'TL'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            <Link
                                                href={`https://www.yeriniayir.com/tr/${offer.slug}`}
                                                target="_blank"
                                                className="flex items-center text-xs text-blue-600 hover:underline"
                                            >
                                                <span className="font-bold w-6">TR:</span> /{offer.slug} <ExternalLink className="w-3 h-3 ml-1" />
                                            </Link>
                                            <Link
                                                href={`https://www.worldandhotels.com/en/${offer.slug}`}
                                                target="_blank"
                                                className="flex items-center text-xs text-emerald-600 hover:underline"
                                            >
                                                <span className="font-bold w-6">EN:</span> /{offer.slug} <ExternalLink className="w-3 h-3 ml-1" />
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        {new Date(offer.created_at).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEditClick(offer)}
                                            className="mr-2 h-8 w-8"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteClick(offer.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Teklifi Düzenle</DialogTitle>
                    </DialogHeader>
                    {editingOffer && (
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setIsWarming(true);
                                const formData = new FormData(e.currentTarget);
                                const slug = formData.get('slug') as string;

                                formData.append('included_items', JSON.stringify(currentItems));

                                try {
                                    const result = await updateOffer(editingOffer.id, formData);

                                    if (!result?.success) {
                                        setIsWarming(false);
                                        alert(`Hata: ${result?.error || 'Güncelleme başarısız oldu.'}`);
                                        return;
                                    }

                                    // Removed blocking loop for speed
                                    setIsWarming(false);
                                    setIsEditOpen(false);
                                    window.location.reload(); // Refresh to show changes immediately
                                } catch (err) {
                                    setIsWarming(false);
                                    console.error(err);
                                    alert("Beklenmeyen bir hata oluştu.");
                                }
                            }}
                            className="space-y-4 py-4"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="edit-hotel_name">Otel Adı</Label>
                                <Input
                                    id="edit-hotel_name"
                                    name="hotel_name"
                                    defaultValue={editingOffer.hotel_name}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-slug">URL Slug</Label>
                                <Input
                                    id="edit-slug"
                                    name="slug"
                                    defaultValue={editingOffer.slug}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-price">Fiyat</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="edit-price"
                                        name="price"
                                        defaultValue={editingOffer.price}
                                        className="flex-1"
                                        required
                                    />
                                    <Select name="currency" defaultValue={editingOffer.currency || "TL"}>
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="Para Birimi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TL">TL (₺)</SelectItem>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                            <SelectItem value="GBP">GBP (£)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-promo_text">Aylık Fiyat (Metin)</Label>
                                <Input
                                    id="edit-promo_text"
                                    name="promo_text"
                                    defaultValue={editingOffer.promo_text}
                                    placeholder="Örn: Aylık ~2.071 TL"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-region">Bölge</Label>
                                <Input
                                    id="edit-region"
                                    name="region"
                                    defaultValue={editingOffer.region}
                                    onChange={(e) => setTempRegion(e.target.value)}
                                    required
                                />
                            </div>

                            {/* INCLUDED ITEMS */}
                            <IncludedItemsEditor
                                items={currentItems}
                                onChange={setCurrentItems}
                                region={tempRegion}
                            />

                            {isWarming && (
                                <div className="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center p-4 text-center">
                                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900">Teklif Oluşturuluyor & Hızlandırılıyor...</h3>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Sayfanın dünya genelinde (CDN) önbelleğe alınması için erişim testi yapılıyor.
                                        <br />Lütfen bekleyiniz...
                                    </p>
                                </div>
                            )}

                            <DialogFooter>
                                <Button type="submit" disabled={isWarming}>
                                    {isWarming ? 'Güncelleniyor...' : 'Güncelle'}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
