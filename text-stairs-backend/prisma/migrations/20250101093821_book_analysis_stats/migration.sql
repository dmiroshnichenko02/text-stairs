-- CreateTable
CREATE TABLE "BookAnalysis" (
    "id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "prompt_tokens" INTEGER NOT NULL,
    "completion_tokens" INTEGER NOT NULL,
    "total_tokens" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "finish_reason" TEXT,
    "cost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BookAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookAnalysis_book_id_key" ON "BookAnalysis"("book_id");

-- AddForeignKey
ALTER TABLE "BookAnalysis" ADD CONSTRAINT "BookAnalysis_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
