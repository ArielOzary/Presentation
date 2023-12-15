using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoLog.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Rename_ProviderInfo_Courier_To_Payment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Courier",
                table: "ProviderInfos",
                newName: "Payment");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Payment",
                table: "ProviderInfos",
                newName: "Courier");
        }
    }
}
