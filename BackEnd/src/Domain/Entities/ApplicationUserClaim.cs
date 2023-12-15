﻿using Microsoft.AspNetCore.Identity;

namespace AutoLog.Domain.Entities;

public class ApplicationUserClaim : IdentityUserClaim<string>
{
    public virtual ApplicationUser User { get; set; } = null!;
}
