import { User } from "@/app/(users)/types/program";
import { Exercise, Program, Session } from "@/app/(users)/types/session";

// Types
interface PDFGeneratorProps {
  sessions: Session[];
  programs: Program[];
  exercises: Exercise[];
}

// Fonctions utilitaires
const getExerciseName = (exercises: Exercise[], exerciseId: string): string => {
  return (
    exercises.find((e) => e._id === exerciseId)?.name || "Unknown Exercise"
  );
};

const getProgramName = (programs: Program[], programId: string): string => {
  return programs.find((p) => p._id === programId)?.name || "Unknown Program";
};

const getActiveSessions = (
  sessions: Session[],
  programs: Program[]
): Session[] => {
  return sessions.filter((session) => {
    const program = programs.find((p) => p._id === session.program);
    return program && program.isActive;
  });
};

const drawTableHeader = (
  pdf: any,
  yPosition: number,
  margin: number,
  colWidths: number[],
  colPositions: number[]
): number => {
  const headerHeight = 10;

  // Draw header background
  pdf.setFillColor(41, 128, 185); // Blue background
  pdf.rect(
    margin,
    yPosition,
    colWidths.reduce((a, b) => a + b, 0),
    headerHeight,
    "F"
  );

  // Header text
  pdf.setTextColor(255, 255, 255); // White text
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");

  const headers = ["Program", "Date", "Categories", "Exercises"];
  headers.forEach((header, index) => {
    pdf.text(header, colPositions[index] + 2, yPosition + 7);
  });

  pdf.setTextColor(0, 0, 0); // Reset to black text
  return yPosition + headerHeight;
};

const drawTableRow = (
  pdf: any,
  session: Session,
  sessionIndex: number,
  yPosition: number,
  margin: number,
  colWidths: number[],
  colPositions: number[],
  rowHeight: number,
  programs: Program[],
  exercises: Exercise[]
): number => {
  // Prepare row data
  const programName = getProgramName(programs, session.program);
  const date = new Date(session.date).toLocaleDateString();
  const categories = session.categories.map((cat) => cat.name).join(", ");

  // Format exercises
  let exercisesText = "";
  session.categories.forEach((category) => {
    exercisesText += `${category.name}: `;
    category.exercises.forEach((exercise, exIndex) => {
      if (exIndex > 0) exercisesText += "; ";
      exercisesText += `${getExerciseName(exercises, exercise.name)} (`;
      exercisesText += exercise.sets
        .map(
          (set, idx) =>
            `${set.repetition}r${set.weight ? `×${set.weight}kg` : ""}`
        )
        .join(", ");
      exercisesText += ")";
    });
    exercisesText += " ";
  });

  // Set font for data
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");

  // Split text to fit in columns
  const programLines = pdf.splitTextToSize(programName, colWidths[0] - 4);
  const dateLines = pdf.splitTextToSize(date, colWidths[1] - 4);
  const categoryLines = pdf.splitTextToSize(categories, colWidths[2] - 4);
  const exerciseLines = pdf.splitTextToSize(exercisesText, colWidths[3] - 4);

  // Calculate row height based on maximum lines
  const maxLines = Math.max(
    programLines.length,
    dateLines.length,
    categoryLines.length,
    exerciseLines.length
  );
  const actualRowHeight = Math.max(rowHeight, maxLines * 4 + 2);

  // Draw row background (alternating colors)
  if (sessionIndex % 2 === 0) {
    pdf.setFillColor(248, 249, 250); // Light gray
    pdf.rect(
      margin,
      yPosition,
      colWidths.reduce((a, b) => a + b, 0),
      actualRowHeight,
      "F"
    );
  }

  // Draw cell borders
  colWidths.forEach((width, index) => {
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(colPositions[index], yPosition, width, actualRowHeight);
  });

  // Add text to cells
  pdf.text(programLines, colPositions[0] + 2, yPosition + 4);
  pdf.text(dateLines, colPositions[1] + 2, yPosition + 4);
  pdf.text(categoryLines, colPositions[2] + 2, yPosition + 4);
  pdf.text(exerciseLines, colPositions[3] + 2, yPosition + 4);

  return yPosition + actualRowHeight;
};

const addPageNumbers = (pdf: any): void => {
  const totalPages = pdf.getNumberOfPages();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 10, {
      align: "right",
    });
  }
};

// Fonction principale de génération PDF
export const generatePDFDocument = async ({
  sessions,
  programs,
  exercises,
}: PDFGeneratorProps): Promise<void> => {
  try {
    // Dynamically import jsPDF
    const { jsPDF } = await import("jspdf");

    const activeSessions = getActiveSessions(sessions, programs);

    if (activeSessions.length === 0) {
      alert("No active sessions to export.");
      return;
    }

    // Create new PDF document in landscape mode
    const pdf = new jsPDF("l", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Title
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Workout Sessions Report", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 10;

    // Date
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 15;

    // Table setup
    const colWidths = [60, 35, 50, 130]; // Column widths
    const colPositions = [
      margin,
      margin + colWidths[0],
      margin + colWidths[0] + colWidths[1],
      margin + colWidths[0] + colWidths[1] + colWidths[2],
    ];
    const rowHeight = 8;

    // Draw initial table header
    yPosition = drawTableHeader(
      pdf,
      yPosition,
      margin,
      colWidths,
      colPositions
    );

    // Draw table rows
    activeSessions.forEach((session, sessionIndex) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = margin;

        // Redraw header on new page
        yPosition = drawTableHeader(
          pdf,
          yPosition,
          margin,
          colWidths,
          colPositions
        );
      }

      yPosition = drawTableRow(
        pdf,
        session,
        sessionIndex,
        yPosition,
        margin,
        colWidths,
        colPositions,
        rowHeight,
        programs,
        exercises
      );
    });

    // Add page numbers
    addPageNumbers(pdf);

    // Create blob and open in new tab
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Open PDF in new tab
    const newWindow = window.open(pdfUrl, "_blank");

    if (!newWindow) {
      alert("Please allow pop-ups to view the PDF");
      URL.revokeObjectURL(pdfUrl);
      return;
    }

    // Clean up the URL after the window is loaded
    newWindow.onload = () => {
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF. Please try again.");
  }
};

// Hook pour utiliser le générateur PDF
export const usePDFGenerator = (
  sessions: Session[],
  programs: Program[],
  exercises: Exercise[]
) => {
  const generatePDF = async () => {
    await generatePDFDocument({ sessions, programs, exercises });
  };

  return { generatePDF };
};
