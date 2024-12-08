'use client'
import { BusinessMemberRole } from '@/lib/api';
import { FC, ComponentPropsWithoutRef, useState, useEffect } from 'react';
import { useBusinessContext } from '../../../components/business-context';
import { useAction } from 'next-safe-action/hooks';
import { getBusinessMemberRoles } from '@/actions/busineses';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';


export interface RoleDropdownsProps extends ComponentPropsWithoutRef<'div'> {
}

// business context state should be mad available on server
export const RoleDropdowns: FC<RoleDropdownsProps> = ({ className, ...props }) => {
  const { currentBusiness } = useBusinessContext();
  const [data, setData] = useState<BusinessMemberRole[]>([]);

  const { execute, isExecuting } = useAction(getBusinessMemberRoles, {
    onSuccess: ({ data }) => {
      setData(data?.roles || []);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  useEffect(() => {
    execute(currentBusiness.id);
  }, [currentBusiness.id]);

  return (
    <div className={className} {...props}>
      {isExecuting ? <div>Loading...</div>
        : data.length > 0 ? data.map((role) => (
          <Collapsible key={role.id}>
            <div className="flex items-center justify-between space-x-4 px-4">
              <h4 className="text-sm font-semibold">
                {role.name}
              </h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <Icons.chevronUpDown className="size-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              {role.permissions?.map((permission, index) => (
                <div key={index}>{permission.value}</div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))
          : (
            <div>No roles found</div>
          )}
    </div>
  );
};
