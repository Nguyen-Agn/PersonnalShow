// Simple PDF generation utility
export async function generateCV(intro: any, other: any) {
  // Create PDF content using basic PDF structure
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/ProcSet [/PDF /Text]
/Font <<
/F1 5 0 R
/F2 6 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 2000
>>
stream
BT
/F1 20 Tf
50 750 Td
(CURRICULUM VITAE) Tj
0 -50 Td
/F2 14 Tf
(Ho va ten: ${intro?.name || 'Creative Designer'}) Tj
0 -25 Td
(Email: ${other?.contactInfo?.email || 'hello@portfolio.com'}) Tj
0 -20 Td
(Dien thoai: ${other?.contactInfo?.phone || '+84 123 456 789'}) Tj
0 -20 Td
(Dia chi: ${other?.contactInfo?.location || 'Ha Noi, Viet Nam'}) Tj
0 -40 Td
/F1 16 Tf
(GIOI THIEU) Tj
0 -25 Td
/F2 12 Tf
(${intro?.description?.substring(0, 100) || 'Toi tao ra nhung trai nghiem so dep va co y nghia'}...) Tj
0 -40 Td
/F1 16 Tf
(KY NANG CHUYEN MON) Tj
0 -30 Td
/F2 12 Tf
${other?.skills?.map((skill: any, index: number) => 
  `0 -20 Td\n(• ${skill.name}: ${skill.description.substring(0, 50)}...) Tj`
).join('\n') || 
`0 -20 Td
(• UI/UX Design: Thiet ke giao dien nguoi dung sang tao) Tj
0 -20 Td
(• Frontend: Phat trien giao dien web hien dai) Tj
0 -20 Td
(• Mobile Design: Thiet ke ung dung di dong) Tj`}
0 -40 Td
/F1 16 Tf
(THONG TIN LIEN HE) Tj
0 -25 Td
/F2 12 Tf
${other?.socialLinks?.github ? `(GitHub: ${other.socialLinks.github}) Tj\n0 -15 Td` : ''}
${other?.socialLinks?.facebook ? `(Facebook: ${other.socialLinks.facebook}) Tj\n0 -15 Td` : ''}
(Website: ${window.location.origin}) Tj
0 -30 Td
(Cap nhat: ${new Date().toLocaleDateString('vi-VN')}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 7
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000120 00000 n 
0000000290 00000 n 
0000002350 00000 n 
0000002420 00000 n 
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
2485
%%EOF`;

  return pdfContent;
}