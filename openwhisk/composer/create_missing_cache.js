composer.sequence(
  "data-science-ontology/list_missing_cache",
  composer.while(
    params => params.missing.length > 0,
    composer.sequence(
      composer.retain(
        params => ({ docid: params.missing[0] }),
        "data-science-ontology/update_annotation_cache"
      ),
      ({ params }) => ({ missing: params.missing.slice(1) })
    )
  )
)