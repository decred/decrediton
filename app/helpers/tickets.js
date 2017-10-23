import { GetTicketsResponse }  from "../middleware/walletrpc/api_pb";

export const TicketTypes = new Map([
  [GetTicketsResponse.TicketDetails.TicketStatus.UNKNOWN, "unknown"],
  [GetTicketsResponse.TicketDetails.TicketStatus.UNMINED, "unmined"],
  [GetTicketsResponse.TicketDetails.TicketStatus.IMMATURE, "immature"],
  [GetTicketsResponse.TicketDetails.TicketStatus.LIVE, "live"],
  [GetTicketsResponse.TicketDetails.TicketStatus.VOTED, "voted"],
  [GetTicketsResponse.TicketDetails.TicketStatus.MISSED, "missed"],
  [GetTicketsResponse.TicketDetails.TicketStatus.EXPIRED, "expired"],
  [GetTicketsResponse.TicketDetails.TicketStatus.REVOKED, "revoked"],
]);
