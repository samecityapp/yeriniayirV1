'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getAdminHotelAnalyticsSummaryAction } from '@/app/[lang]/(admin)/jilinrime/legacyAdminActions';

interface ReportGeneratorProps {
  hotelId: string;
  hotelName: string;
}

export function ReportGenerator({ hotelId, hotelName }: ReportGeneratorProps) {
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const summary = await getAdminHotelAnalyticsSummaryAction(hotelId);
      if (!summary.ok) {
        throw new Error(summary.error || 'Rapor verisi alınamadı.');
      }
      const { views, clicks } = summary.data;

      // Create a temporary DOM element for the report
      const reportDiv = document.createElement('div');
      reportDiv.style.position = 'absolute';
      reportDiv.style.left = '-9999px';
      reportDiv.style.top = '0';
      reportDiv.style.width = '800px';
      reportDiv.style.padding = '40px';
      reportDiv.style.background = '#ffffff';
      reportDiv.style.fontFamily = 'Arial, sans-serif';

      reportDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #1a1a1a; font-size: 32px; margin-bottom: 10px;">GNK Otel Raporu</h1>
          <p style="color: #666; font-size: 16px;">${new Date().toLocaleDateString('tr-TR')}</p>
        </div>
        
        <div style="margin-bottom: 40px; padding: 30px; background: #f8fafc; border-radius: 12px;">
          <h2 style="color: #0f172a; font-size: 24px; margin-bottom: 20px;">${hotelName}</h2>
          <div style="display: flex; gap: 20px;">
            <div style="flex: 1; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <p style="color: #64748b; font-size: 14px; margin-bottom: 5px;">Toplam Görüntülenme</p>
              <p style="color: #0f172a; font-size: 32px; font-weight: bold; margin: 0;">${views || 0}</p>
            </div>
            <div style="flex: 1; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <p style="color: #64748b; font-size: 14px; margin-bottom: 5px;">Toplam Etkileşim</p>
              <p style="color: #0f172a; font-size: 32px; font-weight: bold; margin: 0;">${clicks || 0}</p>
            </div>
          </div>
        </div>

        <div style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 60px;">
          <p>Bu rapor GNK Otel Yönetim Paneli tarafından oluşturulmuştur.</p>
          <p>www.gnkoteller.com</p>
        </div>
      `;

      document.body.appendChild(reportDiv);

      // Convert to canvas then PDF
      const canvas = await html2canvas(reportDiv);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${hotelName.replace(/\s+/g, '_')}_Rapor.pdf`);

      document.body.removeChild(reportDiv);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Rapor oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generateReport}
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      Rapor
    </Button>
  );
}
