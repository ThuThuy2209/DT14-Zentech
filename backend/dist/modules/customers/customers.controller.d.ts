import { CustomersService } from './customers.service.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { FilterCustomerDto } from './dto/filter-customer.dto.js';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto): Promise<{
        success: boolean;
        message: string;
        data: {
            email: string | null;
            status: string;
            createdAt: Date;
            id: number;
            taxCode: string | null;
            address: string | null;
            phone: string | null;
            customerName: string;
            contactPerson: string | null;
        };
    }>;
    findAll(query: FilterCustomerDto): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<{
        success: boolean;
        message: string;
        data: {
            email: string | null;
            status: string;
            createdAt: Date;
            id: number;
            taxCode: string | null;
            address: string | null;
            phone: string | null;
            customerName: string;
            contactPerson: string | null;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
        data: {
            isSoftDeleted: boolean;
        };
    }>;
}
