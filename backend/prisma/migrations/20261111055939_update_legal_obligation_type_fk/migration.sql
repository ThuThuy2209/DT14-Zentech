/*
  Warnings:

  - The primary key for the `legal_obligation_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `obligation_type` on the `legal_obligations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "legal_obligation_types" DROP CONSTRAINT "legal_obligation_types_pkey",
ALTER COLUMN "obligation_type_id" SET DATA TYPE BIGINT,
ADD CONSTRAINT "legal_obligation_types_pkey" PRIMARY KEY ("obligation_type_id");

-- AlterTable
ALTER TABLE "legal_obligations" DROP COLUMN "obligation_type",
ADD COLUMN     "obligation_type_id" BIGINT;

-- AddForeignKey
ALTER TABLE "legal_obligations" ADD CONSTRAINT "legal_obligations_obligation_type_id_fkey" FOREIGN KEY ("obligation_type_id") REFERENCES "legal_obligation_types"("obligation_type_id") ON DELETE SET NULL ON UPDATE CASCADE;
