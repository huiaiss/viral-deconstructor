const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');

const TMP = path.join(__dirname, '..', '..', 'tmp');

function generatePDF(planResult) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const fileName = `plan-${uuid()}.pdf`;
    const filePath = path.join(TMP, fileName);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const p = planResult.shootingPlan || planResult;

    doc.fontSize(20).text(p.title || '拍摄方案', { align: 'center' });
    doc.moveDown();
    doc.fontSize(11).text(`难度: ${p.difficulty || '-'}  |  预计时长: ${p.estimatedTotalTime || '-'}`);
    doc.moveDown();

    if (p.preparations) {
      doc.fontSize(14).text('一、拍摄准备');
      doc.moveDown(0.3);
      doc.fontSize(10);
      doc.text(`设备: ${(p.preparations.equipment || []).join('、')}`);
      doc.text(`道具: ${(p.preparations.props || []).join('、')}`);
      doc.text(`场景: ${p.preparations.location || '-'}`);
      doc.text(`服装: ${p.preparations.costume || '-'}`);
      doc.moveDown();
    }

    doc.fontSize(14).text('二、分镜拍摄表');
    doc.moveDown(0.3);

    (p.shots || []).forEach((shot, i) => {
      doc.fontSize(11).text(`镜头 ${shot.index || i + 1}  (${shot.duration || 0}秒)`, { underline: true });
      doc.fontSize(10);
      doc.text(`景别: ${shot.shotType || '-'}`);
      doc.text(`怎么拍: ${shot.cameraHowTo || '-'}`);
      doc.text(`台词: ${shot.script || '-'}`);
      if (shot.actingTip) doc.text(`表演: ${shot.actingTip}`);
      if (shot.easyAlternative) doc.text(`简化: ${shot.easyAlternative}`);
      doc.moveDown(0.3);
    });

    if (p.editingGuide) {
      doc.fontSize(14).text('三、剪辑指南');
      doc.moveDown(0.3);
      doc.fontSize(10);
      doc.text(`软件: ${p.editingGuide.app || '剪映'}`);
      (p.editingGuide.cuts || []).forEach(c => doc.text(`- ${c}`));
      doc.moveDown();
    }

    if (p.postingGuide) {
      doc.fontSize(14).text('四、发布指南');
      doc.moveDown(0.3);
      doc.fontSize(10);
      doc.text(`标题: ${p.postingGuide.title || '-'}`);
      doc.text(`标签: ${(p.postingGuide.hashtags || []).join(' ')}`);
      doc.moveDown();
    }

    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

module.exports = { generatePDF };
