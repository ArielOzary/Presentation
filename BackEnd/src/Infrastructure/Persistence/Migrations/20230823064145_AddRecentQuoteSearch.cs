using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoLog.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddRecentQuoteSearch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuoteGoods_Quotes_QuoteId",
                table: "QuoteGoods");

            migrationBuilder.DropForeignKey(
                name: "FK_QuoteLoads_Quotes_QuoteId",
                table: "QuoteLoads");

            migrationBuilder.DropIndex(
                name: "IX_QuoteGoods_QuoteId",
                table: "QuoteGoods");

            migrationBuilder.AlterColumn<int>(
                name: "QuoteId",
                table: "QuoteLoads",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "RecentQuoteSearchId",
                table: "QuoteLoads",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "QuoteId",
                table: "QuoteGoods",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "RecentQuoteSearchId",
                table: "QuoteGoods",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "RecentQuoteSearchs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ShippingTypeId = table.Column<int>(type: "int", nullable: true),
                    DestinationId = table.Column<int>(type: "int", nullable: true),
                    OriginId = table.Column<int>(type: "int", nullable: true),
                    IsKnownSupplier = table.Column<bool>(type: "bit", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecentQuoteSearchs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecentQuoteSearchs_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RecentQuoteSearchs_ShippingLocations_DestinationId",
                        column: x => x.DestinationId,
                        principalTable: "ShippingLocations",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RecentQuoteSearchs_ShippingLocations_OriginId",
                        column: x => x.OriginId,
                        principalTable: "ShippingLocations",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RecentQuoteSearchs_ShippingTypes_ShippingTypeId",
                        column: x => x.ShippingTypeId,
                        principalTable: "ShippingTypes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuoteLoads_RecentQuoteSearchId",
                table: "QuoteLoads",
                column: "RecentQuoteSearchId");

            migrationBuilder.CreateIndex(
                name: "IX_QuoteGoods_QuoteId",
                table: "QuoteGoods",
                column: "QuoteId",
                unique: true,
                filter: "[QuoteId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_QuoteGoods_RecentQuoteSearchId",
                table: "QuoteGoods",
                column: "RecentQuoteSearchId",
                unique: true,
                filter: "[RecentQuoteSearchId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_RecentQuoteSearchs_DestinationId",
                table: "RecentQuoteSearchs",
                column: "DestinationId");

            migrationBuilder.CreateIndex(
                name: "IX_RecentQuoteSearchs_OriginId",
                table: "RecentQuoteSearchs",
                column: "OriginId");

            migrationBuilder.CreateIndex(
                name: "IX_RecentQuoteSearchs_ShippingTypeId",
                table: "RecentQuoteSearchs",
                column: "ShippingTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_RecentQuoteSearchs_UserId",
                table: "RecentQuoteSearchs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuoteGoods_Quotes_QuoteId",
                table: "QuoteGoods",
                column: "QuoteId",
                principalTable: "Quotes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_QuoteGoods_RecentQuoteSearchs_RecentQuoteSearchId",
                table: "QuoteGoods",
                column: "RecentQuoteSearchId",
                principalTable: "RecentQuoteSearchs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_QuoteLoads_Quotes_QuoteId",
                table: "QuoteLoads",
                column: "QuoteId",
                principalTable: "Quotes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_QuoteLoads_RecentQuoteSearchs_RecentQuoteSearchId",
                table: "QuoteLoads",
                column: "RecentQuoteSearchId",
                principalTable: "RecentQuoteSearchs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuoteGoods_Quotes_QuoteId",
                table: "QuoteGoods");

            migrationBuilder.DropForeignKey(
                name: "FK_QuoteGoods_RecentQuoteSearchs_RecentQuoteSearchId",
                table: "QuoteGoods");

            migrationBuilder.DropForeignKey(
                name: "FK_QuoteLoads_Quotes_QuoteId",
                table: "QuoteLoads");

            migrationBuilder.DropForeignKey(
                name: "FK_QuoteLoads_RecentQuoteSearchs_RecentQuoteSearchId",
                table: "QuoteLoads");

            migrationBuilder.DropTable(
                name: "RecentQuoteSearchs");

            migrationBuilder.DropIndex(
                name: "IX_QuoteLoads_RecentQuoteSearchId",
                table: "QuoteLoads");

            migrationBuilder.DropIndex(
                name: "IX_QuoteGoods_QuoteId",
                table: "QuoteGoods");

            migrationBuilder.DropIndex(
                name: "IX_QuoteGoods_RecentQuoteSearchId",
                table: "QuoteGoods");

            migrationBuilder.DropColumn(
                name: "RecentQuoteSearchId",
                table: "QuoteLoads");

            migrationBuilder.DropColumn(
                name: "RecentQuoteSearchId",
                table: "QuoteGoods");

            migrationBuilder.AlterColumn<int>(
                name: "QuoteId",
                table: "QuoteLoads",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "QuoteId",
                table: "QuoteGoods",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuoteGoods_QuoteId",
                table: "QuoteGoods",
                column: "QuoteId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_QuoteGoods_Quotes_QuoteId",
                table: "QuoteGoods",
                column: "QuoteId",
                principalTable: "Quotes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_QuoteLoads_Quotes_QuoteId",
                table: "QuoteLoads",
                column: "QuoteId",
                principalTable: "Quotes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
