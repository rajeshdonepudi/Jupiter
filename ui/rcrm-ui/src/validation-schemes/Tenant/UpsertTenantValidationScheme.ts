import { TenantActions } from "@/enumerations/Tenant/tenant-actions.enum";
import { UpsertTenantModel } from "@/models/Tenant/UpsertTenantModel";
import * as yup from "yup";

const UpsertTenantValidationScheme = (action: TenantActions) => {
  switch (action) {
    case TenantActions.AddTenant:
    case TenantActions.UpdateTenant:
      return yup.object<UpsertTenantModel>({
        name: yup.string().required("Name is required"),
        host: yup.string().required("Host name is required"),
        profilePicture: yup.string(),
      });
  }
};

export default UpsertTenantValidationScheme;
