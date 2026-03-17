-- Enable Realtime broadcasts for partner_activity table
-- so the usePartnerActivityRealtime hook receives INSERT events

ALTER TABLE partner_activity REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE partner_activity;
