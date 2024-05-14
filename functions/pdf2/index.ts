// supabase/functions/generate-pdf/index.ts

import { PDFDocument, rgb } from 'https://cdn.skypack.dev/pdf-lib';

Deno.serve(async (req) => {
	if (req.method !== 'POST') {
		return new Response('Method not allowed', { status: 405 });
	}

	try {
		const { invoiceData } = await req.json();

		// Create a new PDF document
		const pdfDoc = await PDFDocument.create();
		const page = pdfDoc.addPage([600, 800]);

		const { width, height } = page.getSize();
		const fontSize = 12;

		// Add invoice title
		page.drawText('Invoice', {
			x: 50,
			y: height - 50,
			size: 24,
			color: rgb(0, 0, 0),
		});

		// Add invoice details
		page.drawText(`Invoice Number: ${invoiceData.invoiceNumber}`, {
			x: 50,
			y: height - 100,
			size: fontSize,
			color: rgb(0, 0, 0),
		});

		page.drawText(`Date: ${invoiceData.date}`, {
			x: 50,
			y: height - 120,
			size: fontSize,
			color: rgb(0, 0, 0),
		});

		page.drawText(`Due Date: ${invoiceData.dueDate}`, {
			x: 50,
			y: height - 140,
			size: fontSize,
			color: rgb(0, 0, 0),
		});

		page.drawText(`Total: ${invoiceData.total}`, {
			x: 50,
			y: height - 160,
			size: fontSize,
			color: rgb(0, 0, 0),
		});

		// Add item headers
		const itemsStartY = height - 200;
		page.drawText('Item', {
			x: 50,
			y: itemsStartY,
			size: fontSize,
			color: rgb(0, 0, 0),
		});
		page.drawText('Description', {
			x: 150,
			y: itemsStartY,
			size: fontSize,
			color: rgb(0, 0, 0),
		});
		page.drawText('Unit Cost', {
			x: 300,
			y: itemsStartY,
			size: fontSize,
			color: rgb(0, 0, 0),
		});
		page.drawText('Quantity', {
			x: 400,
			y: itemsStartY,
			size: fontSize,
			color: rgb(0, 0, 0),
		});
		page.drawText('Line Total', {
			x: 500,
			y: itemsStartY,
			size: fontSize,
			color: rgb(0, 0, 0),
		});

		// Add items
		let currentY = itemsStartY - 20;
		invoiceData.items.forEach((item: any) => {
			page.drawText(item.name, {
				x: 50,
				y: currentY,
				size: fontSize,
				color: rgb(0, 0, 0),
			});
			page.drawText(item.description, {
				x: 150,
				y: currentY,
				size: fontSize,
				color: rgb(0, 0, 0),
			});
			page.drawText(item.unitCost, {
				x: 300,
				y: currentY,
				size: fontSize,
				color: rgb(0, 0, 0),
			});
			page.drawText(item.quantity.toString(), {
				x: 400,
				y: currentY,
				size: fontSize,
				color: rgb(0, 0, 0),
			});
			page.drawText(item.lineTotal, {
				x: 500,
				y: currentY,
				size: fontSize,
				color: rgb(0, 0, 0),
			});
			currentY -= 20;
		});

		const pdfBytes = await pdfDoc.save();

		return new Response(pdfBytes, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename=invoice.pdf',
			},
		});
	} catch (error) {
		console.error('Error generating PDF:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
});

// curl --request POST 'http://localhost:54321/functions/v1/generate-pdf' \
//   --header 'Content-Type: application/json' \
//   --data '{
//     "invoiceData": {
//       "invoiceNumber": "12345",
//       "date": "2023-05-01",
//       "dueDate": "2023-05-15",
//       "total": "$250.00",
//       "items": [
//         { "name": "Item 1", "description": "Description 1", "unitCost": "$50.00", "quantity": 2, "lineTotal": "$100.00" },
//         { "name": "Item 2", "description": "Description 2", "unitCost": "$75.00", "quantity": 2, "lineTotal": "$150.00" }
//       ]
//     }
//   }' --output invoice.pdf
