// Simple export utilities for PDF and DOCX generation
export const generatePDF = async (data: any, options: any): Promise<Blob> => {
  // Simple text-based PDF simulation
  const content = `Document Comparison Report\n\nGenerated: ${new Date().toLocaleString()}\n\nChanges: ${options.includeChanges ? 'Included' : 'Not included'}`;
  return new Blob([content], { type: 'application/pdf' });
};

export const generateDOCX = async (data: any, options: any): Promise<Blob> => {
  // Simple text-based DOCX simulation
  const content = `Document Comparison Report\n\nGenerated: ${new Date().toLocaleString()}\n\nChanges: ${options.includeChanges ? 'Included' : 'Not included'}`;
  return new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
};
