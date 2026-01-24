'use client';

import { useState } from 'react';
import { Offer } from '@/lib/types';
import { createOffer, updateOffer, deleteOffer } from './actions';
// Wait, I didn't see table.tsx in list_dir components/ui. I will use standard HTML table with Tailwind classes instead to be safe.

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
import { Pencil, Trash2, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function OfferManager({ offers }: { offers: Offer[] }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

    const handleEditClick = (offer: Offer) => {
        setEditingOffer(offer);
        setIsEditOpen(true);
    };

    const handleDeleteClick = async (id: string) => {
        if (confirm('Bu teklifi silmek istediğinize emin misiniz?')) {
            await deleteOffer(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Teklif Yönetimi</h2>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="w-4 h-4 mr-2" /> Yeni Teklif Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Yeni Teklif Oluştur</DialogTitle>
                        </DialogHeader>
                        <form
                            action={async (formData) => {
                                await createOffer(formData);
                                setIsAddOpen(false);
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
                                <p className="text-xs text-gray-500">
                                    Adres: yeriniayir.com/<b>slug</b>
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Fiyat</Label>
                                <Input id="price" name="price" placeholder="Örn: 29.000" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="region">Bölge</Label>
                                <Input id="region" name="region" placeholder="Örn: Kapadokya" required />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Oluştur</Button>
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
                                    <td className="p-4">{offer.price} TL</td>
                                    <td className="p-4">
                                        <Link href={`/${offer.slug}`} target="_blank" className="flex items-center text-blue-600 hover:underline">
                                            /{offer.slug} <ExternalLink className="w-3 h-3 ml-1" />
                                        </Link>
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Teklifi Düzenle</DialogTitle>
                    </DialogHeader>
                    {editingOffer && (
                        <form
                            action={async (formData) => {
                                await updateOffer(editingOffer.id, formData);
                                setIsEditOpen(false);
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
                                <Input
                                    id="edit-price"
                                    name="price"
                                    defaultValue={editingOffer.price}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-region">Bölge</Label>
                                <Input
                                    id="edit-region"
                                    name="region"
                                    defaultValue={editingOffer.region}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Güncelle</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
