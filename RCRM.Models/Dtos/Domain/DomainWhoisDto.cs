namespace Jupiter.Models.Dtos.Domain
{
    public class DomainWhoisDto
    {
        public string Domain { get; set; }
        public string DomainId { get; set; }
        public string Status { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public DateTime ExpireDate { get; set; }
        public int DomainAge { get; set; }
        public string WhoisServer { get; set; }
        public DomainRegistrarDto Registrar { get; set; }
        public DomainContactDto Registrant { get; set; }
        public DomainContactDto Admin { get; set; }
        public DomainContactDto Tech { get; set; }
        public DomainBillingDto Billing { get; set; }
        public List<string> Nameservers { get; set; }
    }
}
