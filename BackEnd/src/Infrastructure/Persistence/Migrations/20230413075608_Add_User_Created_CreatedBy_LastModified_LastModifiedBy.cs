using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoLog.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Add_User_Created_CreatedBy_LastModified_LastModifiedBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Companies_CompanyLocation_LocationId",
                table: "Companies");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyContact_Companies_CompanyId",
                table: "CompanyContact");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyLocation_CompanyLocationAddress_InLandAddressId",
                table: "CompanyLocation");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyLocation_CompanyLocationAddress_MailingAddressId",
                table: "CompanyLocation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CompanyLocationAddress",
                table: "CompanyLocationAddress");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CompanyLocation",
                table: "CompanyLocation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CompanyContact",
                table: "CompanyContact");

            migrationBuilder.RenameTable(
                name: "CompanyLocationAddress",
                newName: "CompanyLocationAddresses");

            migrationBuilder.RenameTable(
                name: "CompanyLocation",
                newName: "CompanyLocations");

            migrationBuilder.RenameTable(
                name: "CompanyContact",
                newName: "CompanyContacts");

            migrationBuilder.RenameIndex(
                name: "IX_CompanyLocation_MailingAddressId",
                table: "CompanyLocations",
                newName: "IX_CompanyLocations_MailingAddressId");

            migrationBuilder.RenameIndex(
                name: "IX_CompanyLocation_InLandAddressId",
                table: "CompanyLocations",
                newName: "IX_CompanyLocations_InLandAddressId");

            migrationBuilder.RenameIndex(
                name: "IX_CompanyContact_CompanyId",
                table: "CompanyContacts",
                newName: "IX_CompanyContacts_CompanyId");

            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModified",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastModifiedBy",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CompanyLocationAddresses",
                table: "CompanyLocationAddresses",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CompanyLocations",
                table: "CompanyLocations",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CompanyContacts",
                table: "CompanyContacts",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Companies_CompanyLocations_LocationId",
                table: "Companies",
                column: "LocationId",
                principalTable: "CompanyLocations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyContacts_Companies_CompanyId",
                table: "CompanyContacts",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyLocations_CompanyLocationAddresses_InLandAddressId",
                table: "CompanyLocations",
                column: "InLandAddressId",
                principalTable: "CompanyLocationAddresses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyLocations_CompanyLocationAddresses_MailingAddressId",
                table: "CompanyLocations",
                column: "MailingAddressId",
                principalTable: "CompanyLocationAddresses",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Companies_CompanyLocations_LocationId",
                table: "Companies");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyContacts_Companies_CompanyId",
                table: "CompanyContacts");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyLocations_CompanyLocationAddresses_InLandAddressId",
                table: "CompanyLocations");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyLocations_CompanyLocationAddresses_MailingAddressId",
                table: "CompanyLocations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CompanyLocations",
                table: "CompanyLocations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CompanyLocationAddresses",
                table: "CompanyLocationAddresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CompanyContacts",
                table: "CompanyContacts");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LastModified",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LastModifiedBy",
                table: "AspNetUsers");

            migrationBuilder.RenameTable(
                name: "CompanyLocations",
                newName: "CompanyLocation");

            migrationBuilder.RenameTable(
                name: "CompanyLocationAddresses",
                newName: "CompanyLocationAddress");

            migrationBuilder.RenameTable(
                name: "CompanyContacts",
                newName: "CompanyContact");

            migrationBuilder.RenameIndex(
                name: "IX_CompanyLocations_MailingAddressId",
                table: "CompanyLocation",
                newName: "IX_CompanyLocation_MailingAddressId");

            migrationBuilder.RenameIndex(
                name: "IX_CompanyLocations_InLandAddressId",
                table: "CompanyLocation",
                newName: "IX_CompanyLocation_InLandAddressId");

            migrationBuilder.RenameIndex(
                name: "IX_CompanyContacts_CompanyId",
                table: "CompanyContact",
                newName: "IX_CompanyContact_CompanyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CompanyLocation",
                table: "CompanyLocation",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CompanyLocationAddress",
                table: "CompanyLocationAddress",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CompanyContact",
                table: "CompanyContact",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Companies_CompanyLocation_LocationId",
                table: "Companies",
                column: "LocationId",
                principalTable: "CompanyLocation",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyContact_Companies_CompanyId",
                table: "CompanyContact",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyLocation_CompanyLocationAddress_InLandAddressId",
                table: "CompanyLocation",
                column: "InLandAddressId",
                principalTable: "CompanyLocationAddress",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyLocation_CompanyLocationAddress_MailingAddressId",
                table: "CompanyLocation",
                column: "MailingAddressId",
                principalTable: "CompanyLocationAddress",
                principalColumn: "Id");
        }
    }
}
