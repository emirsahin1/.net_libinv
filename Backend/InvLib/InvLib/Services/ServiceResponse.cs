namespace InvLib.Services
{
    public class ServiceResponse
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }

        public ServiceResponse(bool success, string message = "")
        {
            Succeeded = success;
            Message = message;
        }

    }
}
