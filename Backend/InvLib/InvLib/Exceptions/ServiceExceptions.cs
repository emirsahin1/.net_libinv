﻿namespace InvLib.Exceptions
{
    public class ServiceExceptions
    {
        public class NotFoundException : Exception
        {
            public NotFoundException(string message) : base(message) { }
        }

        public class ServerErrorException : Exception
        {
            public ServerErrorException(string message) : base(message) { }
        }

        public class ValidationException : Exception
        {
            public ValidationException(string message) : base(message) { }
        }
    }
}