// app/api/data/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Тип для наших данных
interface DataItem {
  id: number;
  message: string;
}

// Имитация базы данных
let data: DataItem[] = [{ id: 1, message: 'Initial data' }];

// GET - получить данные
export async function GET() {
  return NextResponse.json(data);
}

// POST - добавить данные
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newItem: DataItem = {
      id: Date.now(),
      message: body.message,
    };
    data.push(newItem);
    return NextResponse.json(
      { message: 'Data added', data: newItem },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// PUT - обновить данные
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    const numericId = Number(id);
    
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const index = data.findIndex((item) => item.id === numericId);
    if (index !== -1) {
      data[index] = { id: numericId, message: body.message };
      return NextResponse.json({
        message: 'Data updated',
        data: data[index],
      });
    } else {
      return NextResponse.json(
        { error: 'Data not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE - удалить данные
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const initialLength = data.length;
    data = data.filter((item) => item.id !== id);
    
    if (data.length < initialLength) {
      return NextResponse.json({ message: 'Data deleted' });
    } else {
      return NextResponse.json(
        { error: 'Data not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}