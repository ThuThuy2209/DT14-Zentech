import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { FilterCustomerDto } from './dto/filter-customer.dto.js';
export declare class CustomersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createCustomerDto: CreateCustomerDto): Promise<{
        email: string | null;
        status: string;
        createdAt: Date;
        id: number;
        taxCode: string | null;
        address: string | null;
        phone: string | null;
        customerName: string;
        contactPerson: string | null;
    }>;
    findAll(query: FilterCustomerDto): Promise<{
        items: ({
            _count: {
                quotations: number;
                contracts: number;
                salesInvoices: number;
            };
        } & {
            email: string | null;
            status: string;
            createdAt: Date;
            id: number;
            taxCode: string | null;
            address: string | null;
            phone: string | null;
            customerName: string;
            contactPerson: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        _count: {
            quotations: number;
            contracts: number;
            salesInvoices: number;
        };
    } & {
        email: string | null;
        status: string;
        createdAt: Date;
        id: number;
        taxCode: string | null;
        address: string | null;
        phone: string | null;
        customerName: string;
        contactPerson: string | null;
    }>;
    update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<{
        email: string | null;
        status: string;
        createdAt: Date;
        id: number;
        taxCode: string | null;
        address: string | null;
        phone: string | null;
        customerName: string;
        contactPerson: string | null;
    }>;
    remove(id: number): Promise<{
        isSoftDeleted: boolean;
        message: string;
    }>;
}
