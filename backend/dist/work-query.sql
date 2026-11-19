SELECT rs.status,rs.provider_account_id,coalesce(eoi.service_id,o.service_id) AS service_id,rs.quantity_to_send AS quantity,count(*)::int AS run_count
FROM public.organic_run_schedule rs
LEFT JOIN public.engagement_order_items eoi ON eoi.id=rs.engagement_order_item_id
LEFT JOIN public.engagement_orders eo ON eo.id=eoi.engagement_order_id
LEFT JOIN public.orders o ON o.id=rs.order_id
WHERE rs.status='pending' AND rs.provider_order_id IS NULL AND rs.provider_history_order_id IS NULL AND rs.started_at IS NULL
AND coalesce(rs.error_message,'') !~* 'dispatch uncertain|dispatching|uncertain.dispatch|claimed'
AND NOT coalesce((rs.provider_response->>'uncertain_dispatch')::boolean,false)
AND coalesce(eoi.status,'pending') NOT IN ('paused','cancelled','refunded','completed')
AND coalesce(eo.status,o.status,'pending') NOT IN ('paused','cancelled','refunded','completed','failed')
GROUP BY rs.status,rs.provider_account_id,coalesce(eoi.service_id,o.service_id),rs.quantity_to_send
UNION ALL
SELECT o.status,NULL::uuid,o.service_id,o.quantity,1 FROM public.orders o
WHERE o.status='pending' AND o.provider_order_id IS NULL AND NOT EXISTS(SELECT 1 FROM public.organic_run_schedule rs WHERE rs.order_id=o.id)
