using AutoLog.Application.Common.Interfaces;
using MediatR;

namespace AutoLog.Application.Admins.Queries.GetSerilogLink;

public sealed class GetSerilogLinkQuery : IRequest<string>
{
    public string Scheme { get; set; } = string.Empty;

    public string Host { get; set; } = string.Empty;
}

public sealed class GetSerilogLinkQueryHandler : IRequestHandler<GetSerilogLinkQuery, string>
{
    private readonly IJwtProvider _jwtProvider;

    public GetSerilogLinkQueryHandler(IJwtProvider jwtProvider)
    {
        _jwtProvider = jwtProvider;
    }

    public async Task<string> Handle(GetSerilogLinkQuery request, CancellationToken cancellationToken)
    {
        var token = await _jwtProvider.GenerateLogsTokenAsync();
        return $"{request.Scheme}://{request.Host}/logs/index.html?logs-token={token}";
    }
}
