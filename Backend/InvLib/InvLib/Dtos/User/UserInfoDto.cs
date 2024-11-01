﻿namespace InvLib.Dtos.User
{
    public class UserInfoDto
    {
        public string? UserId { get; set; }
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public IList<string>? Roles { get; set; }
    }
}
